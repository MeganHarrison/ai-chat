from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from typing import Any, AsyncIterator

from agents import RunConfig, Runner
from agents.model_settings import ModelSettings
from chatkit.agents import AgentContext, stream_agent_response
from chatkit.server import ChatKitServer, StreamingResult
from chatkit.types import (
    Action,
    AssistantMessageContent,
    AssistantMessageItem,
    Attachment,
    HiddenContextItem,
    ThreadItemDoneEvent,
    ThreadItemUpdated,
    ThreadMetadata,
    ThreadStreamEvent,
    UserMessageItem,
    WidgetItem,
    WidgetRootUpdated,
)
from fastapi import Depends, FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, StreamingResponse
from openai.types.responses import (
    EasyInputMessageParam,
    ResponseInputContentParam,
    ResponseInputTextParam,
)
from pydantic import ValidationError
from starlette.responses import JSONResponse

from .airline_state import AirlineStateManager
from .meal_preferences import (
    SET_MEAL_PREFERENCE_ACTION_TYPE,
    SetMealPreferencePayload,
    build_meal_preference_widget,
    meal_preference_label,
)
from .memory_store import MemoryStore
from .nutrition_store import NutritionProfile
from .support_agent import state_manager, support_agent, nutrition_state
from .supabase_history_store import SupabaseHistoryStore
from .thread_item_converter import CustomerSupportThreadItemConverter
from .title_agent import title_agent

DEFAULT_THREAD_ID = "demo_default_thread"
logger = logging.getLogger(__name__)


def _get_customer_profile_as_input_item(profile: NutritionProfile):
    content = (
        "<CUSTOMER_PROFILE>\n"
        f"Name: {profile.name or 'Unknown'}\n"
        f"Age: {profile.age or 'Unknown'}\n"
        f"Gender: {profile.gender or 'Unknown'}\n"
        f"Primary Goal: {profile.primary_goal or 'Unknown'}\n"
        f"Cooking Preference: {profile.cooking_preference if profile.cooking_preference is not None else 'Unknown'}\n"
        f"Eating Habits: {profile.eating_habits or 'Unknown'}\n"
        f"Emotional Why: {profile.emotional_why or 'Unknown'}\n"
        f"Support Level: {profile.support_level or 'Unknown'}\n"
        f"Objection: {profile.objection or 'None recorded'}\n"
        f"Recommended Plan: {profile.recommended_plan or 'Not set'}\n"
        f"Returning User: {profile.returning_user}\n"
        f"Last Seen: {profile.last_seen or 'Unknown'}\n"
        "</CUSTOMER_PROFILE>"
    )

    return EasyInputMessageParam(
        type="message",
        role="user",
        content=[ResponseInputTextParam(type="input_text", text=content)],
    )


class CustomerSupportServer(ChatKitServer[dict[str, Any]]):
    def __init__(
        self,
        agent_state: Any,
    ) -> None:
        store = MemoryStore()
        super().__init__(store)
        self.store = store
        self.agent_state = agent_state
        self.agent = support_agent
        self.title_agent = title_agent
        self.thread_item_converter = CustomerSupportThreadItemConverter()

    async def action(
        self,
        thread: ThreadMetadata,
        action: Action[str, Any],
        sender: WidgetItem | None,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadStreamEvent]:
        if action.type != SET_MEAL_PREFERENCE_ACTION_TYPE:
            return

        payload = self._parse_meal_preference_payload(action)
        if payload is None:
            return

        meal_label = meal_preference_label(payload.meal)
        self.agent_state.set_meal(thread.id, meal_label)

        if sender is not None:
            widget = build_meal_preference_widget(
                selected=payload.meal,
            )
            yield ThreadItemUpdated(
                item_id=sender.id,
                update=WidgetRootUpdated(widget=widget),
            )
            yield ThreadItemDoneEvent(
                item=AssistantMessageItem(
                    thread_id=thread.id,
                    id=self.store.generate_item_id("message", thread, context),
                    created_at=datetime.now(),
                    content=[
                        AssistantMessageContent(
                            text=f'Your meal preference has been updated to "{meal_label}".'
                        )
                    ],
                ),
            )

            hidden = HiddenContextItem(
                id=self.store.generate_item_id("message", thread, context),
                thread_id=thread.id,
                created_at=datetime.now(),
                content=f"<WIDGET_ACTION widgetId={sender.id}>{action.type} was performed with payload: {payload.meal}</WIDGET_ACTION>",
            )
            await self.store.add_thread_item(thread.id, hidden, context)

    async def respond(
        self,
        thread: ThreadMetadata,
        input_user_message: UserMessageItem | None,
        context: dict[str, Any],
    ) -> AsyncIterator[ThreadStreamEvent]:
        # Log incoming user message to history (Supabase messages or in-memory fallback)
        if input_user_message is not None:
            text_chunks = [c.text for c in input_user_message.content if hasattr(c, "text")]
            msg_text = " ".join(text_chunks)
            if history_store is not None:
                history_store.append_turn(session_id=thread.id, role="user", content=msg_text)
            else:
                nutrition_state.append_session_message(
                    session_id=thread.id,
                    user_id=thread.id,
                    turn={
                        "role": "user",
                        "text": msg_text,
                        "ts": datetime.utcnow().isoformat(),
                    },
                )
        # Load all items from the thread to send as agent input.
        # Needed to ensure that the agent is aware of the full conversation
        # when generating a response.
        items_page = await self.store.load_thread_items(thread.id, None, 20, "desc", context)
        updating_thread_title = asyncio.create_task(
            self.maybe_update_thread_title(thread, input_user_message)
        )
        items = list(reversed(items_page.data))  # Runner expects last message last

        # Prepend customer profile as part of the agent input
        profile = nutrition_state.get_profile(thread.id)
        profile_item = _get_customer_profile_as_input_item(profile)
        history_items: list[AssistantMessageContent | ResponseInputContentParam] = []
        if history_store is not None:
            rows = history_store.load_recent(thread.id, limit=20)
            for row in rows:
                msg = row.get("message") or {}
                role = msg.get("role")
                text = msg.get("content")
                ts = msg.get("ts", "")
                if role == "assistant" and text:
                    history_items.append(AssistantMessageContent(text=f"[history {ts}] {text}"))
                elif role == "user" and text:
                    history_items.append(ResponseInputTextParam(type="input_text", text=f"[history {ts}] {text}"))

        input_items = [profile_item] + history_items + (await self.thread_item_converter.to_agent_input(items))

        agent_context = AgentContext(
            thread=thread,
            store=self.store,
            request_context=context,
        )
        result = Runner.run_streamed(
            self.agent,
            input_items,
            context=agent_context,
            run_config=RunConfig(model_settings=ModelSettings(temperature=0.4)),
        )

        async for event in stream_agent_response(agent_context, result):
            # Log assistant responses for history
            if isinstance(event, ThreadItemDoneEvent):
                for content in getattr(event.item, "content", []):
                    if hasattr(content, "text"):
                        if history_store is not None:
                            history_store.append_turn(
                                session_id=thread.id, role="assistant", content=getattr(content, "text")
                            )
                        else:
                            nutrition_state.append_session_message(
                                session_id=thread.id,
                                user_id=thread.id,
                                turn={
                                    "role": "assistant",
                                    "text": getattr(content, "text"),
                                    "ts": datetime.utcnow().isoformat(),
                                },
                            )
            yield event

        await updating_thread_title

    async def maybe_update_thread_title(
        self, thread: ThreadMetadata, user_message: UserMessageItem | None
    ) -> None:
        if user_message is None or thread.title is not None:
            return

        run = await Runner.run(
            title_agent,
            input=await self.thread_item_converter.to_agent_input(user_message),
        )
        model_result: str = run.final_output
        # Capitalize the first letter only
        model_result = model_result[:1].upper() + model_result[1:]
        thread.title = model_result.strip(".")

    async def to_message_content(self, _input: Attachment) -> ResponseInputContentParam:
        raise RuntimeError("File attachments are not supported in this demo.")

    @staticmethod
    def _parse_meal_preference_payload(action: Action[str, Any]) -> SetMealPreferencePayload | None:
        try:
            return SetMealPreferencePayload.model_validate(action.payload or {})
        except ValidationError as exc:
            logger.warning("Invalid meal preference payload: %s", exc)
            return None


support_server = CustomerSupportServer(agent_state=state_manager)
history_store: SupabaseHistoryStore | None = None
try:
    history_store = SupabaseHistoryStore()
except Exception:
    history_store = None


app = FastAPI(title="ChatKit Customer Support API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_server() -> CustomerSupportServer:
    return support_server


@app.post("/support/chatkit")
async def chatkit_endpoint(
    request: Request, server: CustomerSupportServer = Depends(get_server)
) -> Response:
    payload = await request.body()
    result = await server.process(payload, {"request": request})
    if isinstance(result, StreamingResult):
        return StreamingResponse(result, media_type="text/event-stream")
    if hasattr(result, "json"):
        return Response(content=result.json, media_type="application/json")
    return JSONResponse(result)


def _thread_param(thread_id: str | None) -> str:
    return thread_id or DEFAULT_THREAD_ID


@app.get("/support/customer")
async def customer_snapshot(
    thread_id: str | None = Query(None, description="ChatKit thread identifier"),
) -> dict[str, Any]:
    key = _thread_param(thread_id)
    profile = nutrition_state.get_profile(key)
    return {"customer": profile.to_dict()}


@app.get("/support/profile")
async def get_profile(thread_id: str | None = Query(None, description="ChatKit thread identifier")) -> dict[str, Any]:
    key = _thread_param(thread_id)
    profile = nutrition_state.get_profile(key)
    return {"profile": profile.to_dict()}


@app.post("/support/profile")
async def upsert_profile(
    body: dict[str, Any],
    thread_id: str | None = Query(None, description="ChatKit thread identifier"),
) -> dict[str, Any]:
    key = _thread_param(thread_id)
    profile = nutrition_state.upsert_profile(key, body or {})
    return {"profile": profile.to_dict()}


@app.post("/support/recommend_plan")
async def recommend_plan(
    body: dict[str, Any],
    thread_id: str | None = Query(None, description="ChatKit thread identifier"),
) -> dict[str, Any]:
    key = _thread_param(thread_id)
    profile = nutrition_state.upsert_profile(key, body or {})
    plan = nutrition_state.recommend_plan(profile)
    return {"profile": profile.to_dict(), "plan": plan}


@app.post("/support/rag_search")
async def rag_search(
    body: dict[str, Any],
) -> dict[str, Any]:
    query = body.get("query") or ""
    category = body.get("category")
    filters = body.get("filters")
    results = nutrition_state.rag_search(query, category=category, filters=filters)
    return {"query": query, "results": results}


@app.get("/support/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}
