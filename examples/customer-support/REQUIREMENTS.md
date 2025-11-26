Nutrition Solutions AI Sales Coach — Requirements

1) Product goal
Deliver a guided assessment plus intelligent assistant that speaks the Nutrition Solutions brand voice, answers with relevant RAG from Supabase vectors, remembers users (short- and long-term), recommends the right plan, shows a transformation carousel tailored to the user, and supports human handoff when needed.

2) Target users
- New visitors evaluating Nutrition Solutions.
- Returning prospects/customers continuing a conversation.
- Internal support/sales (for human handoff).

3) Key features (scope)
- Guided question path (Messages 1–8) with conditional branches for cooking preference and primary goal.
- Off-route handling: pause the guided flow, answer with RAG, then return naturally to the next best step; never force.
- RAG over Supabase vectors for FAQs, meal plans, testimonials/transformations, and brand voice.
- Memory: short-term (per-session) + long-term Supabase profile with fields: name, age, gender, primary_goal, eating_habits, emotional_why, support_level, objection, recommended_plan, returning_user, last_seen, plus session history linkage.
- Objection detection, storage, and tailored responses.
- Support path trigger and human handoff messaging.
- Transformation carousel widget filtered by user profile; plan recommendation logic (Shred/Beast × Spartan/Gladiator).
- Consistent brand voice: bold, direct, identity-focused, motivational coach.
- Checkout initiation for selected plan.

4) Guided flow (Messages 1–8)
- M1: Welcome + identity-framing (brand voice). Ask name. Store name.
- M2: Primary goal? Options: lose fat, build muscle, recomp/performance. Store primary_goal.
- M3: Age + gender (optional). Store age, gender.
- M4: Eating habits/cooking preference? Options: cook often, sometimes, rarely/never; include delivery/meal-prep constraints. Store eating_habits.
- M5: Support level desired? Options: low, medium, high accountability. Store support_level.
- M6: Emotional why (open-ended). Store emotional_why.
- M7: Potential objections (price/time/taste/variety/delivery/dietary restrictions). Detect and store first clear objection. Keep selling language tailored to objection.
- M8: Recommend plan (see logic). Offer transformation carousel and CTA to checkout or talk to a human. Store recommended_plan.
Branching rules:
- If cooking = rarely/never, prefer Spartan tier; if cook often + high commitment, prefer Gladiator.
- If goal = lose fat → Shred; goal = build muscle → Beast; recomp/performance → choose by user emphasis (fat-loss→Shred, muscle→Beast).
- If user asks off-route question, go to Off-route Handling, then return to next unanswered step.

5) Off-route handling
- Detect off-route intent or factual question.
- Retrieve with RAG (vector_documents) using category filters; answer succinctly in brand voice.
- Return to the next most relevant guided step without pressure; acknowledge the user’s concern.

6) Plan recommendation logic
- Track: Shred (fat loss), Beast (muscle gain).
- Tier: Spartan (lower prep, simpler adherence), Gladiator (higher structure/discipline).
- Mapping:
  - Goal lose fat → Shred; goal build muscle → Beast; otherwise pick by user emphasis.
  - Cooking rarely/never OR low support → Spartan; cooking often AND high support → Gladiator; else lean Spartan.
- Output one of: Shred-Spartan, Shred-Gladiator, Beast-Spartan, Beast-Gladiator.
- Provide short rationale using user’s own words (name, emotional_why, objection handling).

7) Transformation carousel logic
- Data source: vector_documents where category = testimonial or transformation.
- Filter by: gender (if given), age bucket (e.g., 18–24/25–34/35–44/45+), primary_goal, and recommended track (Shred/Beast). Fallback to goal only.
- Display top 6, allow horizontal scroll; each card: before/after, headline, short quote, CTA to selected plan checkout.

8) RAG
- Supabase table: vector_documents(id, content, embedding, category, metadata, created_at).
- Categories: faq, meal_plan, testimonial, brand_voice, objection_handling.
- Retrieval: top_k=6 cosine similarity; filter by category and, when relevant, by goal or plan in metadata; re-rank by recency if scores close.
- Always wrap answers in brand voice; cite implicitly (no raw references).

9) Memory
- Short-term: conversation state machine (guided step index), last question asked, temporary slots.
- Long-term: user_profiles with fields listed below; returning_user set when last_seen exists.
- session_history: store full transcript per session id; last_session_id stored on user profile.
- Use memory to personalize copy, carousel filters, and objections.

10) Data model (Supabase)
- user_profiles (
  id uuid pk,
  name text,
  age int,
  gender text,
  primary_goal text,
  eating_habits text,
  emotional_why text,
  support_level text,
  objection text,
  recommended_plan text,
  returning_user boolean default false,
  last_seen timestamptz,
  last_session_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
- session_history (
  id uuid pk,
  user_id uuid references user_profiles(id),
  session_id uuid,
  messages jsonb,
  created_at timestamptz default now()
)
- vector_documents (
  id uuid pk,
  content text,
  embedding vector,
  category text,
  metadata jsonb,
  created_at timestamptz default now()
)
Triggers/Notes:
- On insert into session_history: upsert user_profiles.last_seen = now(), set returning_user = true if last_seen not null, and set last_session_id.
- On update to user_profiles: maintain updated_at.
- Embeddings generated at ingest time; store category and metadata (goal, gender, plan, age_bucket).

11) Integration and agent pattern
- Use ChatKit agent pattern with components: GuidedFlowAgent, RAGAgent, MemoryWriter, HandoffAgent.
- RAG triggers: off-route questions, objection-specific content, meal plan specifics, and when user asks for examples/testimonials.
- Memory writes: after each guided step or when user provides a field.

12) Handoff rules
- Trigger when user explicitly requests human help OR expresses crisis/medical edge cases OR multiple unresolved objections.
- Messaging: acknowledge, promise next-step, collect email/phone if missing, and confirm expected response window.

13) Brand voice
- Bold, direct, identity-focused, motivational coach. Confident and supportive; concise, high-energy. Mirror user language while staying on-brand.

14) Acceptance criteria
- Guided flow runs end-to-end with branches; off-route answers with RAG and returns smoothly.
- Plan recommendation picks correct variant and explains why.
- Carousel shows filtered, relevant transformations.
- RAG answers are relevant and consistent with brand voice; no hallucinations outside vector store scope.
- Memory: returning users recognized; prior details used; objections remembered and handled.
- Support path and human handoff messaging works and logs.
- Checkout path initiates with recommended_plan.

15) Constraints
- Use Supabase for auth, tables, triggers, and vector store.
- Keep repo outputs concise (plans/schemas/contracts), no heavy code.
- Tone must match brand-voice documents in the vector store.
