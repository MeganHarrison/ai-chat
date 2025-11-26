# TEST CHECKLIST — Go/No-Go

- Guided flow completes M1–M8 with branching; plan shown.
- Off-route answers return RAG (≥0.78 sim) + resume question; dual off-route prompt appears.
- Returning users greeted and skipped fields; last_seen updated.
- Objections stored and echoed in follow-ups; persisted to profile.
- Support handoff banner shows and does not block chat.
- Carousel filters by goal/gender/age band; fallback tiers work.
- recommend_plan mapping correct (fat_loss→Shred, muscle_gain→Beast, recomposition tie-break; Spartan vs Gladiator based on cooking/support).
- CTA fires tracking payload with user_id + recommended_plan and opens checkout_url.
- Session_history captures turns and timestamps.
- Tone: bold/direct, no hedging across sampled replies.
