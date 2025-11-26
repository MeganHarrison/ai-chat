import { FlameKindling, HeartPulse, Home, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

import type { NutritionProfile, PlanRecommendation } from "../hooks/useCustomerContext";
import { ObjectionCapture } from "./ObjectionCapture";
import { PlanCard } from "./PlanCard";
import { HandoffBanner } from "./HandoffBanner";
import { TransformationCarousel, type TestimonialItem } from "./TransformationCarousel";

type CustomerContextPanelProps = {
  profile: NutritionProfile | null;
  loading: boolean;
  error: string | null;
  onRecommendPlan: () => void;
  recommending?: boolean;
  onSaveObjection: (value: string) => Promise<void>;
};

const TRANSFORMATION_FIXTURES: TestimonialItem[] = [
  {
    id: "t1",
    name: "Mia · down 18 lbs",
    goal: "fat_loss",
    gender: "female",
    age_bracket: "31-45",
    result: "Lost 18 lbs in 10 weeks",
    blurb: "Busy mom of two. Shred Spartan kept meals simple and consistent.",
  },
  {
    id: "t2",
    name: "Carlos · added lean mass",
    goal: "muscle_gain",
    gender: "male",
    age_bracket: "31-45",
    result: "+7 lbs lean mass in 12 weeks",
    blurb: "Beast Gladiator paired heavy lifts with macro guidance and accountability.",
  },
  {
    id: "t3",
    name: "Ari · recomposition",
    goal: "recomp",
    gender: "female",
    age_bracket: "<=30",
    result: "Lost 10 lbs fat while gaining strength",
    blurb: "Dialed in protein targets and hydration cadence.",
  },
  {
    id: "t4",
    name: "Jordan · busy founder",
    goal: "fat_loss",
    gender: "male",
    age_bracket: "46+",
    result: "Dropped 14 lbs without long workouts",
    blurb: "Gladiator playbook focused on travel-friendly meals and sleep.",
  },
];

export function CustomerContextPanel({
  profile,
  loading,
  error,
  onRecommendPlan,
  recommending,
  onSaveObjection,
}: CustomerContextPanelProps) {
  if (loading) {
    return (
      <section className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_45px_90px_-45px_rgba(15,23,42,0.5)] ring-1 ring-slate-200/60 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_45px_95px_-55px_rgba(15,23,42,0.85)] dark:ring-slate-800/60">
        <header>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Coach snapshot</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Loading profile…</p>
        </header>
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          Syncing Nutrition Solutions profile…
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex h-full flex-col gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-6 text-rose-700 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
        <header>
          <h2 className="text-xl font-semibold">Coach snapshot</h2>
        </header>
        <p className="text-sm">{error}</p>
      </section>
    );
  }

  if (!profile) {
    return null;
  }

  const ageBracket = deriveAgeBracket(profile.age);
  const plan: PlanRecommendation | undefined = profile.recommended_plan
    ? {
        program: inferProgram(profile.primary_goal),
        variant: inferVariant(profile.support_level, profile.cooking_preference),
        recommended_plan: profile.recommended_plan,
      }
    : undefined;
  const checkoutUrl = plan?.recommended_plan
    ? `https://nutrition-solutions.com/checkout?plan=${encodeURIComponent(plan.recommended_plan)}`
    : undefined;
  const planLabel = plan?.recommended_plan || (plan ? `${plan.program} — ${plan.variant}` : null);
  const objectionLabel = profile.objection || null;
  const shouldShowHandoff = (objectionLabel || "").toLowerCase().includes("human");

  return (
    <section className="flex h-full flex-col gap-4 overflow-auto rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-[0_45px_90px_-45px_rgba(15,23,42,0.5)] ring-1 ring-slate-200/60 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 dark:shadow-[0_45px_95px_-55px_rgba(15,23,42,0.85)] dark:ring-slate-800/60">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-500 dark:text-orange-300">Nutrition Solutions</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{profile.name || "New client"}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Goal: {profile.primary_goal || "not set"}
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/40 dark:text-orange-200">
            {profile.returning_user ? "Returning" : "First session"}
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
          Last seen {profile.last_seen ? formatDate(profile.last_seen) : "—"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Tag tone={planLabel ? "primary" : "muted"}>
            {planLabel ? `Plan: ${planLabel}` : "Plan not set"}
          </Tag>
          <Tag tone={objectionLabel ? "warn" : "muted"}>
            {objectionLabel ? `Objection: ${objectionLabel}` : "No objection captured"}
          </Tag>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2">
        <InfoPill icon={UserRound} label="Age">{profile.age ? `${profile.age}` : "Not set"}</InfoPill>
        <InfoPill icon={Home} label="Cooking preference">{formatCooking(profile.cooking_preference)}</InfoPill>
        <InfoPill icon={HeartPulse} label="Support level">{profile.support_level ?? "Not set"}</InfoPill>
        <InfoPill icon={FlameKindling} label="Why now">{profile.emotional_why || "Not captured"}</InfoPill>
      </section>

      <PlanCard
        recommendation={plan}
        goal={profile.primary_goal}
        supportLevel={profile.support_level}
        cookingPreference={profile.cooking_preference}
        onGenerate={onRecommendPlan}
        generating={recommending}
        checkoutUrl={checkoutUrl}
      />

      <TransformationCarousel
        items={TRANSFORMATION_FIXTURES}
        goal={profile.primary_goal || undefined}
        gender={profile.gender || undefined}
        age_bracket={ageBracket}
      />

      <ObjectionCapture value={profile.objection} onSubmit={onSaveObjection} />
      {shouldShowHandoff ? <HandoffBanner reason={objectionLabel} /> : null}
    </section>
  );
}

function InfoPill({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/90 px-4 py-3 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <Icon className="h-5 w-5 text-orange-500" aria-hidden />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{children}</p>
      </div>
    </div>
  );
}

function Tag({ children, tone }: { children: React.ReactNode; tone: "primary" | "warn" | "muted" }) {
  const toneClass =
    tone === "primary"
      ? "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-100"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-100"
        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-200";

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}

function deriveAgeBracket(age?: number | null) {
  if (!age) return null;
  if (age <= 30) return "<=30";
  if (age <= 45) return "31-45";
  return "46+";
}

function formatCooking(value?: boolean | null) {
  if (value === true) return "Cooks most meals";
  if (value === false) return "Prefers done-for-you";
  return "Not set";
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch (err) {
    return value;
  }
}

function inferProgram(goal?: string | null) {
  if (!goal) return undefined;
  if (goal.toLowerCase().includes("muscle")) return "Beast";
  if (goal.toLowerCase().includes("recomp")) return "Shred";
  return "Shred";
}

function inferVariant(support?: number | null, cooking?: boolean | null) {
  if (!support && cooking === undefined) return undefined;
  if ((support ?? 0) >= 4 || cooking === false) return "Gladiator";
  return "Spartan";
}
