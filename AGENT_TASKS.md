Project: Nutrition Solutions AI Sales Coach

General constraints
- Use ChatKit agent pattern (GuidedFlowAgent, RAGAgent, MemoryWriter, HandoffAgent).
- Supabase for profile storage, session history, and vector store.
- Keep outputs concise and actionable; provide plans, schemas, and contracts rather than heavy code.

Designer
- Deliverables:
  - /design/design_spec.md — Conversational scripts (M1–M8), UI states, widget specs, tone rules.
- Include:
  - Exact wording for each step, off-route microcopy, objection handling snippets by category.
  - Visual spec for transformation carousel (card layout, filters, CTA states).
  - Chat UI states: guided step, off-route answer, resume banner, handoff banner.
  - Brand voice checklist.

Frontend Developer
- Deliverables:
  - /frontend/frontend_plan.md — Component map, state machine, data contracts, integration notes.
- Implement:
  - Guided flow state machine with resume-after-RAG.
  - Components: Chat thread, Composer, StepProgress, Carousel, PlanSummary, HandoffBanner.
  - Data contracts for profile fields, recommendation payload, events (checkout_initiated, handoff_triggered).
  - Supabase client usage and session storage; returning user greeting.
  - RAG answer rendering and natural resume.

Backend Developer
- Deliverables:
  - /backend/backend_plan.md — Schema SQL (tables/triggers), RPCs, vector ingest/retrieval, event logging.
- Implement:
  - Tables: user_profiles, session_history, vector_documents; triggers for updated_at and last_seen/returning_user.
  - RPCs: upsert_profile_fields, log_session, get_transformations(goal, gender, age_bucket, track), recommend_plan(profile_fields).
  - Vector pipeline: embed + insert with category/metadata; retrieval contracts.
  - Handoff logging and contact capture.

Tester
- Deliverables:
  - /tests/TEST_PLAN.md — Scenario-based tests mapping to acceptance criteria.
  - /tests/test_checklist.md — Step-by-step checklist for regression.
- Focus:
  - End-to-end guided flow, off-route behavior, RAG quality, memory persistence, recommendation correctness, carousel relevance, handoff reliability, brand voice consistency.

Key technical notes and constraints (all roles)
- Supabase schema (authoritative): see REQUIREMENTS.md section 10.
- RAG triggers: off-route, objection handling, meal plan specifics, testimonials/examples.
- Guided flow: Messages 1–8 with branches for goal and cooking/support; resume logic required.
- Brand voice: bold, direct, identity-focused, motivational.
- Handoff rules: explicit human help requests, medical/edge cases, or repeated unresolved objections.
