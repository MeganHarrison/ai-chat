Backend Implementation Plan — Nutrition Solutions AI Sales Coach

## Goals
- Provide Supabase-backed long-term memory, session logging, RAG search, objection/support handling, and plan recommendation for the ChatKit agent.
- Enforce brand voice + flow policy via agent prompts while keeping data protected (RLS).

## Schema (Supabase SQL outline)
- user_profiles  
  id uuid primary key references auth.users on delete cascade  
  name text  
  age integer  
  gender text check in ('male','female','nonbinary','prefer_not')  
  primary_goal text check in ('fat_loss','muscle_gain','recomp')  
  eating_habits text  
  emotional_why text  
  support_level int  
  cooking_preference boolean  
  objection text  
  recommended_plan text  
  returning_user boolean default false  
  last_seen timestamptz  
  created_at timestamptz default now()  
  updated_at timestamptz default now()  
  triggers: BEFORE INSERT/UPDATE set updated_at = now(); AFTER INSERT/UPDATE set last_seen = now(); AFTER UPDATE set returning_user = true when OLD.created_at != NEW.created_at.

- messages (chat history)  
  id serial primary key  
  session_id text  
  message jsonb (e.g., {role, content, ts})  
  created_at timestamptz default now()

- rag_documents  
  id uuid primary key  
  content text  
  embedding vector(1536)  
  category text check in ('faq','meal_plans','testimonials','brand_voice')  
  metadata jsonb (goal, gender, age_bracket, cuisine, tone_anchor)  
  created_at timestamptz default now()

- RLS: enable row security on user_profiles/rag_documents/messages; policy user_id = auth.uid(); forbid PII in rag_documents.

## RPCs / functions
- upsert_profile(p_profile jsonb) → returns merged profile; updates last_seen/returning_user.  
- append_session_message(p_session_id text, p_user_id uuid, p_turn jsonb) → append to messages table.  
- rag_search(p_query text, p_category text default null, p_filters jsonb default null, p_top_k int default 5, p_min_score float default 0.75) → [{content, score, category, metadata}].  
- recommend_plan(p_profile jsonb) → {plan_family, variant, recommended_plan}; mapping:  
  • primary_goal fat_loss → plan_family "Shred"; muscle_gain → "Beast".  
  • support_level ≤3 and cooking_preference=true → variant "Spartan"; else "Gladiator".  
  • recomposition: ask lean vs build; default lean → Shred, build → Beast.  
  • recommended_plan = "{plan_family}-{variant}".

## Ingestion
- Load/embed: faq, meal_plans, testimonials (anonymized), brand_voice.  
- Store metadata (goal, gender, age_bracket) for carousel filtering.  
- Use OpenAI embeddings; batch insert into vector_documents.

## ChatKit agent integration
- Prepend profile context: load user profile by thread_id/user_id; synthesize into `<PROFILE>` block.  
- Memory: combine thread store (short-term) + Supabase profile/session_history (long-term).  
- Off-route: when classified off-route, call rag_search with category by intent; resume pending question.  
- Objections: on detection, call upsert_profile with objection; tailor response.  
- Support handoff: set escalation flag; emit handoff message.  
- Plan recommendation: call recommend_plan after Message 8 inputs; return payload for frontend CTA + plan card text.

## Endpoints (FastAPI)
- POST /support/chatkit (existing) — keep.  
- GET /support/customer — return merged profile view.  
- POST /support/profile — proxy to upsert_profile.  
- POST /support/rag_search — proxy to rag_search.  
- POST /support/recommend_plan — proxy to recommend_plan.  
- POST /support/append_session — proxy to append_session_message.

## Operational notes
- Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY.  
- Add retry/backoff for Supabase RPC calls.  
- Log RAG queries (no PII content); latency budgets: guided step <2s, RAG <3s p95.
