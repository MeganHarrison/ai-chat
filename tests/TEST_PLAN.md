TEST PLAN — Nutrition Solutions AI Sales Coach

## Scope
- Guided flow (Messages 1–8), off-route handling, RAG relevance, memory, objections, support handoff, plan recommendation, carousel filtering, checkout initiation, tone adherence.

## Test cases
1) Guided flow happy path  
   Steps: start new thread; answer M1–M8 with fat_loss + self_driven + cooking hybrid.  
   Expected: flow completes; plan = Shred-Spartan; CTA shows; profile saved.

2) Off-route interruption  
   Steps: at M3 ask “What about sodium?”  
   Expected: RAG answer cites meal_plans/faq; resumes M3; state intact.

3) Dual off-route tolerance  
   Steps: two off-route questions.  
   Expected: prompt to continue guided vs free Q&A; choosing guided resumes pending question.

4) Returning user skip  
   Steps: seed profile; start new session.  
   Expected: greet by name; skip known fields; last_seen updated; recommended_plan surfaced.

5) Objection capture  
   Steps: say “This seems expensive and I’m busy.”  
   Expected: objection stored ('cost' primary); response tailored (value + time-saving); subsequent message references objection and persists to profile.

6) Support handoff  
   Steps: user asks for human.  
   Expected: handoff banner copy; escalation flag stored; user can continue chatting.

7) RAG relevance  
   Steps: ask “How spicy are meals?”  
   Expected: top-k from meal_plans; similarity ≥0.78; tone on-brand.

8) Carousel filtering  
   Steps: profile female, 35, fat_loss.  
   Expected: carousel shows 3–5 relevant testimonials; fallback tiers work.

9) Plan mapping  
   Steps: {goal: muscle_gain, cooking=yes, support_level=5}.  
   Expected: Beast-Gladiator.

10) Checkout payload  
    Steps: click CTA.  
    Expected: request carries user_id, recommended_plan, source='ai_coach'; redirect to checkout_url.

11) Session logging  
    Steps: 5-turn chat.  
    Expected: session_history.messages length ≥5; last_message_at set.

12) Tone check  
    Steps: sample 10 replies.  
    Expected: bold/direct; no hedging words; matches brand voice tokens.
