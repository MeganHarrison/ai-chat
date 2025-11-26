Frontend Implementation Plan — Nutrition Solutions AI Sales Coach

## Goals
- Implement ChatKit UI that runs the guided flow (Messages 1–8), off-route handling, RAG answers, plan recommendation, objection capture, support handoff, and transformation carousel.
- Preserve bold, direct brand voice across prompts and UI copy; skip redundant questions for returning users.

## Steps
1) Configuration
- Env: `VITE_CHATKIT_API_DOMAIN_KEY`, `VITE_SUPPORT_API_BASE` (or neutral rename), `VITE_SUPPORT_CHATKIT_API_URL`, `VITE_SUPPORT_CUSTOMER_URL`, `VITE_SUPPORT_GREETING`.
- Update `frontend/src/lib/config.ts` starter prompts and greeting to Nutrition Solutions hooks; enforce brand-voice wrapper in system prompt.

2) State and flow control
- Create `GuidedFlowAgent` wrapper in the ChatKit client that tracks step (1–8), answers, off_route_count, recommended_plan, objection, support_handoff.
- Persist flow state in memory + localStorage keyed by thread_id; on load, request profile to skip already-known questions.
- Off-route: route free-form questions to RAG, then resume with the previous pending question; after 2 off-route interruptions, offer “continue guided” vs “ask anything”.

3) Components and contracts
- `TransformationCarousel` props: `{items: TestimonialItem[], goal: string, gender?: string, age_bracket?: string, onSelect?: (id) => void}`; fallback tiers: goal+demographics → goal-only → global top.
- `PlanRecommendation` props: `{plan_family: "Shred"|"Beast", variant: "Spartan"|"Gladiator", summary: string, ctaLabel: string, checkoutUrl: string}`.
- Objection capture: chips + free text; emit `onObjection(objection: string)`; badge in side panel.
- Support handoff banner: non-blocking message with CTA (“Text VIP Concierge”) plus “Continue self-serve”.
- Side panel: show profile fields, last_seen, recommended_plan, objections, session status.

4) Data hooks (call backend RPCs/rest)
- `getProfile(user_id|thread_id)` → profile; prefill flow.
- `upsertProfile(patch)` on each answered step; set returning_user and last_seen.
- `appendSessionMessage(session_id, turn)` after each message pair.
- `rag_search({query, category?, filters?, top_k?, min_score?})` when off-route or user taps “Not yet — I have questions”.
- `recommendPlan(profile)` → {plan_family, variant, recommended_plan}; surface in UI + CTA payload.

5) ChatKit wiring
- Inject system prompt with brand voice and flow policy.
- Add client-side widget for carousel: render when agent sends widget payload or when flow hits Message 7; support agent-triggered updates (filters).
- Handle action events: objection logged, support handoff triggered, CTA click to checkout.

6) UX copy and tone
- Use design_spec copy skeletons for Messages 1–8; keep short, imperative sentences.
- Blocklist hedging (“maybe”, “might”); run outputs through a post-filter if needed before render.

7) Returning users
- On mount, request profile; greet by name; skip known steps; show “Welcome back” banner with last_seen and recommended_plan if present.

8) Checkout initiation
- CTA: “Start {recommended_plan}” → open checkout_url; fire tracking payload `{user_id, recommended_plan, source:"ai_coach", thread_id}`.

9) Events and telemetry
- Emit events: checkout:start {program,tier}, handoff:create {user_id, reason, contact}, carousel:show {filters}, objection:capture {label}, recommendation:emit {plan}.
- Log off-route occurrences and resume confirmations for QA.

## Deliverables
- This plan file.
- Interfaces/prop contracts above to align with backend RPCs and design_spec.
