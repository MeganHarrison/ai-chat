# Nutrition Solutions AI Sales Coach — Design Spec

Purpose
- Blueprint the guided assessment experience, off-route handling, plan recommendation, carousel display, and handoff UI in the Nutrition Solutions brand voice.

Inputs
- REQUIREMENTS.md, TEST.md, AGENT_TASKS.md
- Brand voice doc (vector store): bold, direct, identity-focused, motivational coach

Conversation flow (Messages 1–8)
1) Intro + name — hook, ask first name
2) Primary goal — fat loss / muscle gain / recomp; if recomp, follow-up preference lean vs build
3) Age + gender
4) Cooking preference — yes/no (cooks most meals)
5) Eating habits — brief self-assessment or constraints
6) Emotional why — why now
7) Support level — 1–5
8) Objection check + recommendation — capture objection (price/time/taste/etc.), deliver plan and CTA

Off-route pattern
- Detect off-route question; pause slot-filling; answer with RAG (Supabase vectors: faq, meal_plan, testimonials, brand_voice).
- Cite source title briefly; offer “Resume guided path?” quick-reply. Do not force resume.

Recommendation logic (UI/state)
- Program: Shred if primary_goal=fat_loss; Beast if muscle_gain; Recomp → ask lean vs build (default Shred if unanswered).
- Tier: Spartan if support_level ≤3 and cooking_preference=yes; Gladiator if support_level ≥4 or cooking_preference=no.
- Display as “{Program} — {Tier}” with 2–3 benefit bullets and a CTA “Start {Program} — {Tier}”.

Transformation carousel
- Filters: goal match; gender match if provided; age band (≤30, 31–45, 46+). Fallback to goal-only.
- Show ≥3 cards or a fallback state; include name/goal/result snippet and “Why this fits you” blurb tied to filters.

Handoff UI
- Triggered when user asks for human, repeats objection, or high support with unresolved objection.
- Banner/modal copy: confirm handoff, collect preferred contact, promise response time; allow “Keep chatting” without blocking.

States and components
- Chat stream with quick-reply chips for scripted steps.
- Off-route notice + resume prompt.
- Carousel widget (props: goal, gender, age_bracket, items[], onSelect?).
- Plan card (props: program, tier, rationale bullets, CTA).
- Handoff banner (props: reason, contact options).

Tone guide (apply to all copy)
- Bold, direct, identity-focused, motivational; challenge excuses; concise sentences; no hedging.

Acceptance for this spec
- Contains copy skeletons for steps 1–8 and off-route/handoff states.
- Defines filters and fallbacks for carousel; shows recommendation display and CTA.
- Describes handoff banner behavior and contact capture.
- Aligns with REQUIREMENTS/TEST/AGENT_TASKS; no extra files or tools introduced.
