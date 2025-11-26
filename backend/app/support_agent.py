from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from agents import Agent, RunContextWrapper, StopAtTools, function_tool
from chatkit.agents import AgentContext
from chatkit.types import AssistantMessageContent, AssistantMessageItem, ThreadItemDoneEvent

from .airline_state import AirlineStateManager
from .meal_preferences import build_meal_preference_widget
from .nutrition_store import NutritionState
from .supabase_store import SupabaseNutritionStore

SUPPORT_AGENT_INSTRUCTIONS = """
You are a Nutrition Solutions AI Sales Coach. You run a guided assessment, give bold/direct
recommendations, handle off-route questions with RAG, and can hand off to a human when asked.

Flow (keep short, punchy, human):
- Collect: name, primary goal (fat loss/muscle gain/recomp), age, gender, cooking preference,
  eating habits, emotional why, support level (1-5), objection (price/time/taste/other).
- Use the stored profile in <CUSTOMER_PROFILE> to avoid repeating known info.
- When off-route: answer with facts (RAG) then offer to resume the guided flow.
- Recommendation: Shred for fat_loss; Beast for muscle_gain; Recomp → ask lean vs build (default lean→Shred).
  Variant: Spartan if cooks and support_level<=3; Gladiator otherwise. Format: "{Program} — {Variant}".
- Tone: bold, direct, identity-focused coach; no hedging.

Tools you can call:
- record_profile(field: str, value: str) – persist a single field to the profile.
- record_objection(label: str, detail: str | None) – persist an objection.
- recommend_plan() – compute the recommended plan and store it.
- rag_search(query: str, category: str | None, filters: dict | None) – retrieve facts to answer off-route.
- handoff(reason: str, contact: str | None) – request human follow-up.

Always call record_profile/record_objection when you collect a new slot or objection. Use rag_search when off-route.
""".strip()


def build_support_agent(state_manager: AirlineStateManager, nutrition_state: NutritionState) -> Agent[AgentContext]:
    """Create the Nutrition Solutions sales coach with task-specific tools."""

    def _thread_id(ctx: RunContextWrapper[AgentContext]) -> str:
        return ctx.context.thread.id

    @function_tool(
        description_override="Persist a single field to the user profile.",
    )
    async def record_profile(
        ctx: RunContextWrapper[AgentContext],
        field: str,
        value: str,
    ) -> Dict[str, str]:
        nutrition_state.upsert_profile(_thread_id(ctx), {field: value})
        return {"result": f"Stored {field}."}

    @function_tool(
        description_override="Persist an objection label and optional detail to the profile.",
    )
    async def record_objection(
        ctx: RunContextWrapper[AgentContext],
        label: str,
        detail: str | None = None,
    ) -> Dict[str, str | None]:
        nutrition_state.upsert_profile(_thread_id(ctx), {"objection": label})
        return {"result": f"Stored objection: {label}", "detail": detail}

    @function_tool(
        description_override="Compute and store the recommended plan for the user.",
    )
    async def recommend_plan_tool(
        ctx: RunContextWrapper[AgentContext],
    ) -> Dict[str, str]:
        profile = nutrition_state.get_profile(_thread_id(ctx))
        plan = nutrition_state.recommend_plan(profile)
        return {"result": plan["recommended_plan"]}

    @function_tool(
        description_override="Query RAG documents to answer off-route questions.",
    )
    async def rag_search_tool(
        ctx: RunContextWrapper[AgentContext],
        query: str,
        category: str | None = None,
        filters: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:
        results = nutrition_state.rag_search(query, category=category, filters=filters)
        return {"results": results}

    @function_tool(
        description_override="Request a human handoff and capture contact preference.",
    )
    async def handoff(
        ctx: RunContextWrapper[AgentContext],
        reason: str,
        contact: str | None = None,
    ) -> Dict[str, str | None]:
        nutrition_state.upsert_profile(_thread_id(ctx), {"handoff_reason": reason, "handoff_contact": contact})
        return {"result": "Escalated to human support.", "reason": reason, "contact": contact}

    tools = [
        record_profile,
        record_objection,
        recommend_plan_tool,
        rag_search_tool,
        handoff,
    ]

    return Agent[AgentContext](
        model="gpt-4.1-mini",
        name="Nutrition Solutions Coach",
        instructions=SUPPORT_AGENT_INSTRUCTIONS,
        tools=tools,  # type: ignore[arg-type]
        tool_use_behavior=StopAtTools(stop_at_tool_names=[]),
    )


state_manager = AirlineStateManager()

try:
    _supabase_store = SupabaseNutritionStore()
    nutrition_state: NutritionState | SupabaseNutritionStore = _supabase_store
except Exception:
    nutrition_state = NutritionState()

support_agent = build_support_agent(state_manager, nutrition_state)
