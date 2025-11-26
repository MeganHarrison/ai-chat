Nutrition Solutions AI Sales Coach — Cross-Functional Test Tasks

How to read: Each task lists [Owner] and acceptance criteria. Owners: Designer, Frontend, Backend, Tester.

1) Guided flow copy and branching
- [Designer] Provide final scripts for Messages 1–8 with branch prompts and fallback copy.
- Acceptance: Scripts cover all steps, include brand-voice examples, and specify branch prompts for cooking and goal.

2) Conversation state machine
- [Frontend] Implement guided flow state with off-route resume capability.
- Acceptance: Off-route question is answered, and flow resumes at the correct next step without duplicating questions.

3) RAG retrieval relevance
- [Backend] Implement vector search with category filters and metadata.
- Acceptance: For 10 sample queries (FAQs, meal plan details, testimonials), at least 8/10 top answers are sourced from relevant docs; no uncited external claims.

4) Brand voice consistency
- [Tester] Validate tone across 20 responses.
- Acceptance: 90%+ responses exhibit bold, direct, motivational voice with identity framing.

5) Memory write/read (short-term and long-term)
- [Backend] Persist fields to user_profiles and session_history; [Frontend] read and personalize UI.
- Acceptance: Returning user greeted by name and last goal; last_seen updated; session history available for review.

6) Objection detection and use
- [Backend] Detect and persist first clear objection; [Frontend] surface tailored follow-up.
- Acceptance: When user states a price/time/taste/etc. objection, it is stored and referenced in the next reply.

7) Plan recommendation logic
- [Frontend] Implement mapping and display rationale; [Backend] provide contract.
- Acceptance: Given test fixtures:
  - lose fat + rarely cook + low support → Shred-Spartan
  - build muscle + cook often + high support → Beast-Gladiator
  - recomp + sometimes cook + medium support → lean Shred-Spartan (explain tie-break)

8) Transformation carousel filter
- [Frontend] Implement widget; [Backend] supply filtered items.
- Acceptance: Cards reflect user gender/age bucket/goal/track where data exists; at least 4 relevant items shown or graceful fallback.

9) Support path + human handoff
- [Frontend] UI affordance and messaging; [Backend] event/log + contact capture.
- Acceptance: Trigger logs event, collects contact if missing, and displays SLA confirmation.

10) Checkout initiation
- [Frontend] CTA routes to plan checkout; [Backend] records selection.
- Acceptance: Clicking checkout CTA emits event with recommended_plan and opens the correct path.

11) Returning user recognition
- [Backend] Mark returning_user on repeat visits; [Frontend] greet appropriately.
- Acceptance: Second session sets returning_user=true and greets with “Welcome back, {name}”.

12) Error/edge cases
- [Tester] Interruptions, empty answers, medical disclaimers.
- Acceptance: Graceful prompts, medical edge cases route to human handoff.

Artifacts to verify during testing
- /design/design_spec.md
- /frontend/frontend_plan.md
- /backend/backend_plan.md
- /tests/TEST_PLAN.md and /tests/test_checklist.md
