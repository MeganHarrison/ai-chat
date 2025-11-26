# Task Status — Nutrition Solutions AI Sales Coach

Legend: ✅ complete · 🔄 in progress · ⏳ not started

## Completed
- ✅ REQUIREMENTS.md updated (Nutrition Solutions scope)
- ✅ TEST.md updated (cross-functional tasks/acceptance)
- ✅ AGENT_TASKS.md updated (role deliverables)
- ✅ design/design_spec.md regenerated (guided flow, off-route, carousel, handoff, tone)
- ✅ frontend/frontend_plan.md regenerated (state machine, events, contracts)
- ✅ backend/backend_plan.md regenerated (schema, RPCs, recomposition mapping)
- ✅ tests/TEST_PLAN.md regenerated (RAG threshold 0.78, mappings)
- ✅ tests/test_checklist.md regenerated (sim threshold, recomposition mapping)
- ✅ In-memory nutrition_store added
- ✅ Supabase schema drafted (backend/app/supabase_schema.sql)
- ✅ Supabase store stub added (backend/app/supabase_store.py)
- ✅ Support agent retooled to Nutrition coach (record_profile, recommend_plan, handoff)
- ✅ API endpoints added: /support/profile, /support/recommend_plan, /support/rag_search
- ✅ Supabase types generated from project (supabase-types.ts)
- ✅ Supabase history store added (messages table) and wired to log user+assistant turns with recency injection into agent input
- ✅ Agent tools expanded: objection logging, rag_search tool, handoff upserts into profile

## In Progress
- 🔄 Backend: choose store dynamically (Supabase vs in-memory) — partially done; Supabase RAG embedding still placeholder in SQL.

## To Do (detailed)
- ⏳ Backend: Wire SupabaseNutritionStore.rag_search to real vector query against rag_documents (RPC match_rag_documents) using actual embeddings (replace placeholder vector), top_k=4, min_score=0.78, category filter, recency tie-break.
- ⏳ Backend: Replace in-memory usage in main/support_agent with Supabase store in production (env-guarded).
- ⏳ Backend: Add objection logging and support handoff payload persistence to profile/session.
- ⏳ Backend: Finalize recommend_plan RPC/endpoint signature to match frontend contract.
- ⏳ Frontend: Implement guided flow state machine (steps 1–8), off-route pause/resume, objection capture, handoff banner, CTA events per frontend_plan.
- ⏳ Frontend: Implement TransformationCarousel filtering (goal, gender, age band) with fallback tiers.
- ⏳ Frontend: Integrate with new endpoints (profile, recommend_plan, rag_search, session logging).
- ⏳ Frontend: Enforce brand voice guardrails (pre-send checklist or post-filter).
- ⏳ Tests: Execute tests/TEST_PLAN.md and tests/test_checklist.md after backend/frontend integration; document results.
- ⏳ QA: Verify acceptance criteria (RAG relevance, recommendation mapping, carousel relevance, handoff triggers, returning user recognition, tone).
