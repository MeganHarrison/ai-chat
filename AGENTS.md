# Project Brief

## Requirements

- Long term and short term memory
- RAG from Supabase vector store for FAQ’s, testimonials, and meal plans
- Ability to handoff to human support
- Remember user when they return to the website
- Intelligent conversation that feels natural if user strays from the conversation path
- Utilize tone of voice detailed in the Brand Voice document

## Resources

- NS Brand Voice
- Meal Plans
- Testimonials
- Objections
- FAQ’s
- Website Copy
- Transformation Images
- Meeting Transcript

## 1. Overview

The Nutrition Solutions AI Sales Coach is a guided assessment + intelligent assistant designed to:

- Convert new visitors through a structured transformation consult.
- Break from the script intelligently when users go off-route.
- Provide personalized plan recommendations.
- Use RAG to answer questions from Supabase vector stores.
Use long-term + short-term memory to recognize returning users.
Match the Nutrition Solutions brand voice (bold, direct, identity-focused).
Display a Transformation Carousel widget filtered to the user.
Support existing clients with a dedicated support path.
Handoff to human support when needed.

*This system must function like a hybrid sales coach + transformation mentor — not a chatbot.*

## 2. Architecture Requirements

### 2.1 Memory

#### Short-Term Memory

Entire current session is accessible for reasoning, synthesis, and follow-up.

#### Long-Term Memory (Supabase)

name
age
gender
primary goal
eating habits
emotional why
objection
desired support level
recommended plan
returning user flag
session history
Last Seen (update date the user visited the site)

Behavior:
When a user returns → retrieve their stored profile and continue intelligently.

#### Supabase user_profile schema

Update this if changes are made.
create table public.user_profiles (
  id uuid not null,
  email text not null,
  full_name text null,
  is_admin boolean null default false,
  created_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone not null default CURRENT_TIMESTAMP,
  age integer null,
  gender text null,
  primary_goal text null,
  eating_habits text null,
  emotional_why text null,
  support_level text null,
  objection text null,
  recommended_plan text null,
  returning_user boolean null default false,
  last_seen timestamp with time zone null,
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create trigger set_user_profiles_updated_at BEFORE
update on user_profiles for EACH row
execute FUNCTION set_updated_at ();

#### 2.2 RAG (Retrieval-Augmented Generation)

Use Supabase vector embeddings for:
- FAQ document
- Meal plan document
- Testimonials / transformation stories
- Brand voice reference

RAG is triggered when:
- User asks a question outside the flow
- User clicks “Not yet — I have questions”
- Objections need deeper content
- User doubts the plan
- Existing clients need support information
- A plan explanation needs specificity

#### 2.3 Routing Logic

The agent must:

- Follow a scripted guided transformation flow.
- Detect “off-route” deviations immediately.
Pause the flow → answer with reasoning + RAG → return to CTA naturally.
Detect existing clients and move them into the Support Path.
Detect objections and trigger correct objection-handling scripts.
Use conditional messaging when the user chooses the hybrid cooking option.
Always maintain tone consistency.

## **3. Tone & Delivery Requirements**

The voice must fully match Nutrition Solutions brand guidelines. Review the brand-voice.md for full details.

/Users/meganharrison/Documents/github/ns projects/NS-Agent-Builder/docs/brand-voice.md

* Bold
* Direct
* No fluff
* Identity-focused
* Psychology-driven
* Motivational, not salesy
* A coach, not a chatbot
* Humanized, compact, punchy

Avoid long-winded explanations.
Focus on identity, accountability, and emotional truth.

---


## **4. Guided Flow — Sequential Question Path**

Below is the complete **ordered script flow.**

### MESSAGE 1 — Attention Hook (Automatic)

```
Quick question — are you proud of the reflection you see when you look in the mirror?

If not, don’t worry. I’m here to help you figure out exactly what needs to change and guide you toward the fastest path to real transformation.

Want me to walk you through it?
```

### MESSAGE 2 — Frame the System and Gather Data

(Only if users implies yes)

```
"Great. I’m going to ask you a few quick questions to understand where you’re at right now, so I can guide you toward the fastest, lowest-stress path to the results you want.

First things first — what’s your first name, age, and are you male or female?"
```

### MESSAGE 3 — PRIMARY GOAL

```
Got it! What’s your primary goal?

- Get rid of the muffin top and look amazing in (and out of) clothes
- Build muscle, strength, and performance
- Reclaim energy, confidence, and momentum
```

### MESSAGE 4 — CURRENT EATING HABITS

```
"How would you rate your current eating habits — if we’re being brutally honest?

- I eat pretty good… I think?
- Very inconsistent
- Not gonna lie — I treat my body like a human garbage disposal
```

### MESSAGE 5 — THE EMOTIONAL ROOT (“WHY NOW?”)

```
Alright. You told me where you’re at and what you want. But here’s the truth — real breakthrough comes from understanding why you want it. That’s the part that determines whether this becomes another attempt… or the transformation that changes everything.

So tell me… why do you really want this?

Pick the one that hits hardest, or type your own.

- I’ve been overweight for years and I’m sick and tired of feeling sick and tired.
- I want to reclaim my energy, confidence, and pride — and set the right example for the people who depend on me.
- I want to put on muscle and get in the best shape of my life.
```

### MESSAGE 6 — ROLE OF NUTRITION SOLUTIONS

```
Last question… Based on where you’re at, how do you see Nutrition Solutions supporting your transformation?”

- I want the express pass to results — no cooking, no thinking, no excuses.
- I’ll use a smaller plan and still cook some meals on my own.
- Not sure yet.
```

### MESSAGE 7 — Testimonials Showcase

Let the user know you'll be right back with your recommendations based on their unique situation. Use this as an opportunity to share client transformations. provide your recommendation.

Example:

```
Thank you! Give me a second while I create my recommendations based on everything you shared.

In the meantime, here are a few clients who started right where you are now — similar age, goals, and struggles… and look at what happened when they stopped making excuses and started executing…

EMBED TRANSFORMATION CAROUSEL WIDGET (Auto-filtered based on their inputs)
```

#### Conditional logic:

If they choose the “smaller plan / cooking on my own” option, incorporate the importance of consistency in the message. Break up the response in multiple message bubbles so its easier to read.

**Example:**

```
Makes sense. Just remember — your current eating habits brought you here.

Consistency is the shortcut to transformation.

Whether you get all your meals from us or none, what matters is removing the decisions that sabotage your progress.

Give me a second while I create my recommendations based on everything you shared.

In the meantime, here are a few clients who started right where you are now — similar age, goals, and struggles… and look at what happened when they stopped making excuses and started executing…

EMBED TRANSFORMATION CAROUSEL WIDGET (Auto-filtered based on their inputs)
```

### MESSAGE 8 — Synthesis + Plan Recommendation

Send immediately after the previous message. The agent must:

1. Summarize profile
2. Use RAG to enhance reasoning
3. Recommend best plan
4. Explain the logic
5. Provide targeted transformation examples

This must feel **personalized, authoritative, and psychology-aware**.

**Conditional logic:**
- Shred Spartan - If the user did not specify their goal was to gain muscle and they want to do some cooking on their own.
- Shred Gladiator - If the user did not specify their goal was to gain muscle and they want all their meals provided.
- Beast Spartan - user stated their goal is to build muscle and they want to do some cooking on their own.
- Beast Gladiator - user stated their goal is to build muscle and they want all their meals provided.

## 6. Off-Route Logic

During the guided process, many users may stray off course. If this happens:

1. Pause flow
2. Answer with reasoning + RAG
3. Lead user back into CTA or next step gracefully

Never “force” the user back to the flow.
Must feel natural and intelligent.
**If the user wants to speak to a human support rep initiate handoff.***

Triggers:

* Freeform questions
* Skipped steps
* Pricing questions
* Emotional venting
* Doubts or fears
* Technical questions

## 5. Objection Classification**

If the user signals a specific objection save this in Supabase in the objection column. Tailor responses with master psychology skills to overcome the objections if possible.

Example verbiage that identifies probably objections:

* I don’t think it will work for me
* I’m worried about the cost
* I’ve failed so many plans
* I’m overwhelmed
* I’m not consistent
* I’ve tried everything

## **6. Support Path (Existing Clients)**

Triggered when user says:

* I’m a current client
* Question about my order
* Help with meals
* Support issues

Behavior:

* Acknowledge
* Provide RAG-based answers
* If unresolved → **human handoff**

**Handoff Message:**
“If you want the fastest response, text our VIP Client Concierge. Otherwise, tell me what’s going on and I’ll pass it to our team.”

## **7. Supabase Data Model**

#### **user_profiles table**

Stores:

* name
* age
* gender
* primary goal
* eating habits
* emotional why
* objection
* support level
* recommended plan
* returning user flag
* timestamps

#### **session_history table**

* session id
* user id
* messages json
* timestamps

#### **vector_documents table**

For embedding and RAG:

* doc id
* content
* embedding
* category (FAQ, meal plans, testimonials, etc.)

---

# **9. Acceptance Criteria**

The build is complete when:

* Guided flow runs end-to-end
* Agent responds naturally to deviations
* RAG answers are accurate + relevant
* Personalized plan recommendations work
* Carousel filters correctly
* Support path triggers reliably
* Returning users are recognized
* Tone matches brand voice
* Human handoff functions
* Checkout flow initiates flawlessly

---

## **10. Deliverables**

* Full AgentKit workflow
* All prompts for each node
* Supabase integration code
* RAG pipeline
* Long-term memory storage/retrieval
* Transformation carousel display logic
* Checkout path logic
* Deployment-ready configuration