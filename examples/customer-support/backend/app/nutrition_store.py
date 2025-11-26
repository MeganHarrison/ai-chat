from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional


@dataclass
class NutritionProfile:
    id: str
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    primary_goal: Optional[str] = None  # fat_loss | muscle_gain | recomp
    cooking_preference: Optional[bool] = None
    eating_habits: Optional[str] = None
    emotional_why: Optional[str] = None
    support_level: Optional[int] = None
    objection: Optional[str] = None
    recommended_plan: Optional[str] = None
    returning_user: bool = False
    last_seen: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "age": self.age,
            "gender": self.gender,
            "primary_goal": self.primary_goal,
            "cooking_preference": self.cooking_preference,
            "eating_habits": self.eating_habits,
            "emotional_why": self.emotional_why,
            "support_level": self.support_level,
            "objection": self.objection,
            "recommended_plan": self.recommended_plan,
            "returning_user": self.returning_user,
            "last_seen": self.last_seen,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


@dataclass
class SessionHistory:
    session_id: str
    user_id: str
    messages: List[Dict[str, Any]] = field(default_factory=list)
    started_at: datetime = field(default_factory=datetime.utcnow)
    last_message_at: Optional[datetime] = None

    def append(self, turn: Dict[str, Any]) -> None:
        self.messages.append(turn)
        self.last_message_at = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "session_id": self.session_id,
            "user_id": self.user_id,
            "messages": self.messages,
            "started_at": self.started_at,
            "last_message_at": self.last_message_at,
        }


class NutritionState:
    """
    Lightweight, in-memory stand-in for the Supabase-backed profile + session store.
    This lets the ChatKit agent and HTTP endpoints work without external dependencies.
    """

    def __init__(self) -> None:
        self._profiles: Dict[str, NutritionProfile] = {}
        self._sessions: Dict[str, SessionHistory] = {}

    def get_profile(self, user_id: str) -> NutritionProfile:
        if user_id not in self._profiles:
            self._profiles[user_id] = NutritionProfile(
                id=user_id,
                returning_user=False,
                last_seen=datetime.utcnow(),
            )
        return self._profiles[user_id]

    def upsert_profile(self, user_id: str, patch: Dict[str, Any]) -> NutritionProfile:
        profile = self.get_profile(user_id)
        for key, value in patch.items():
            if hasattr(profile, key):
                setattr(profile, key, value)
        now = datetime.utcnow()
        profile.updated_at = now
        profile.last_seen = now
        # Mark returning_user if this isn't the first time we've seen the profile.
        if profile.created_at != profile.updated_at:
            profile.returning_user = True
        return profile

    def append_session_message(self, session_id: str, user_id: str, turn: Dict[str, Any]) -> SessionHistory:
        if session_id not in self._sessions:
            self._sessions[session_id] = SessionHistory(session_id=session_id, user_id=user_id)
        session = self._sessions[session_id]
        session.append(turn)
        return session

    def recommend_plan(self, profile: NutritionProfile) -> Dict[str, str]:
        goal = (profile.primary_goal or "fat_loss").lower()
        cooking = profile.cooking_preference is True
        support = profile.support_level or 1

        program = "Shred" if goal in ("fat_loss", "recomp") else "Beast"
        variant = "Spartan" if cooking and support <= 3 else "Gladiator"
        recommended_plan = f"{program} — {variant}"
        profile.recommended_plan = recommended_plan
        profile.updated_at = datetime.utcnow()
        return {"program": program, "variant": variant, "recommended_plan": recommended_plan}

    def rag_search(
        self, query: str, category: Optional[str] = None, filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        # Placeholder retrieval; integrate pgvector-backed Supabase in production.
        return []
