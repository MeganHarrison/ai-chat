from __future__ import annotations

import os
from datetime import datetime
from typing import Any, Dict, List, Optional

import httpx
from openai import OpenAI

from .nutrition_store import NutritionProfile


class SupabaseNutritionStore:
    """
    Minimal Supabase-backed store using REST endpoints. Falls back to exceptions on failure.
    Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.
    """

    def __init__(self) -> None:
        base_url = os.getenv("SUPABASE_URL")
        api_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not base_url or not api_key:
            raise RuntimeError("Supabase env vars missing")
        self.base_url = base_url.rstrip("/") + "/rest/v1"
        self.headers = {
            "apikey": api_key,
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
        }
        self.openai_client = OpenAI(api_key=openai_api_key) if openai_api_key else None

    def _request(
        self, method: str, path: str, params: Optional[Dict[str, Any]] = None, json: Optional[Any] = None
    ) -> Any:
        url = f"{self.base_url}/{path.lstrip('/')}"
        response = httpx.request(method, url, headers=self.headers, params=params, json=json, timeout=10.0)
        response.raise_for_status()
        if response.text:
            return response.json()
        return None

    def upsert_profile(self, user_id: str, patch: Dict[str, Any]) -> NutritionProfile:
        payload = {"id": user_id, **patch, "last_seen": datetime.utcnow().isoformat()}
        self._request("POST", "user_profiles", json=payload)
        data = self._request("GET", "user_profiles", params={"id": f"eq.{user_id}", "limit": 1})
        record = data[0] if data else payload
        return self._to_profile(record)

    def get_profile(self, user_id: str) -> NutritionProfile:
        data = self._request("GET", "user_profiles", params={"id": f"eq.{user_id}", "limit": 1})
        if data:
            return self._to_profile(data[0])
        return self.upsert_profile(user_id, {})

    def append_session_message(self, session_id: str, user_id: str, turn: Dict[str, Any]) -> None:
        payload = {
            "session_id": session_id,
            "message": {
                "role": turn.get("role"),
                "content": turn.get("text") or turn.get("content"),
                "ts": turn.get("ts") or datetime.utcnow().isoformat(),
            },
        }
        self._request("POST", "messages", json=payload)

    def recommend_plan(self, profile: NutritionProfile) -> Dict[str, str]:
        goal = (profile.primary_goal or "fat_loss").lower()
        cooking = profile.cooking_preference is True
        support = profile.support_level or 1
        program = "Shred" if goal in ("fat_loss", "recomp") else "Beast"
        variant = "Spartan" if cooking and support <= 3 else "Gladiator"
        recommended_plan = f"{program} — {variant}"
        self.upsert_profile(profile.id, {"recommended_plan": recommended_plan})
        return {"program": program, "variant": variant, "recommended_plan": recommended_plan}

    def rag_search(
        self, query: str, category: Optional[str] = None, filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Call a Supabase RPC `match_rag_documents` that searches public.rag_documents.
        Expected RPC params:
          - query_text (string)
          - query_embedding (vector) OPTIONAL: if provided by client
          - category (string, optional)
          - filters (jsonb, optional)
          - match_count (int)
          - min_score (float)
        """
        rpc_payload: Dict[str, Any] = {
            "query_text": query,
            "match_count": 4,
            "min_score": 0.78,
        }
        if category:
            rpc_payload["category"] = category
        if filters:
            rpc_payload["filters"] = filters
        # If we have an embeddings client, embed locally and send embedding to RPC (if supported).
        if self.openai_client is not None:
            try:
                emb = (
                    self.openai_client.embeddings.create(model="text-embedding-3-large", input=query)
                    .data[0]
                    .embedding
                )
                rpc_payload["query_embedding"] = emb
            except Exception:
                pass
        try:
            result = self._request("POST", "rpc/match_rag_documents", json=rpc_payload)
            return result or []
        except Exception:
            return []

    @staticmethod
    def _to_profile(record: Dict[str, Any]) -> NutritionProfile:
        return NutritionProfile(
            id=str(record.get("id")),
            name=record.get("name"),
            age=record.get("age"),
            gender=record.get("gender"),
            primary_goal=record.get("primary_goal"),
            cooking_preference=record.get("cooking_preference"),
            eating_habits=record.get("eating_habits"),
            emotional_why=record.get("emotional_why"),
            support_level=record.get("support_level"),
            objection=record.get("objection"),
            recommended_plan=record.get("recommended_plan"),
            returning_user=bool(record.get("returning_user")) if record.get("returning_user") is not None else False,
            last_seen=record.get("last_seen"),
            created_at=record.get("created_at") or datetime.utcnow(),
            updated_at=record.get("updated_at") or datetime.utcnow(),
        )
