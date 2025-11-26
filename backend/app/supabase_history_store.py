from __future__ import annotations

import os
from datetime import datetime
from typing import Any, Dict, List, Optional

import httpx


class SupabaseHistoryStore:
    """
    Wrapper for the public.messages table to store/retrieve chat history.
    Expects SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.
    """

    def __init__(self) -> None:
        base_url = os.getenv("SUPABASE_URL")
        api_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not base_url or not api_key:
            raise RuntimeError("Supabase env vars missing")
        self.base_url = base_url.rstrip("/") + "/rest/v1"
        self.headers = {
            "apikey": api_key,
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
        }

    def _request(
        self, method: str, path: str, params: Optional[Dict[str, Any]] = None, json: Optional[Any] = None
    ) -> Any:
        url = f"{self.base_url}/{path.lstrip('/')}"
        resp = httpx.request(method, url, headers=self.headers, params=params, json=json, timeout=10.0)
        resp.raise_for_status()
        if resp.text:
            return resp.json()
        return None

    def append_turn(self, session_id: str, role: str, content: str) -> None:
        payload = {
            "session_id": session_id,
            "message": {"role": role, "content": content, "ts": datetime.utcnow().isoformat()},
        }
        self._request("POST", "messages", json=payload)

    def load_recent(self, session_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        rows = self._request(
            "GET",
            "messages",
            params={
                "session_id": f"eq.{session_id}",
                "order": "created_at.asc",
                "limit": limit,
            },
        )
        return rows or []
