import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import clsx from "clsx";

export type PlanRecommendation = {
  program?: string | null;
  variant?: string | null;
  recommended_plan?: string | null;
};

type PlanCardProps = {
  recommendation?: PlanRecommendation;
  goal?: string | null;
  supportLevel?: number | null;
  cookingPreference?: boolean | null;
  onGenerate: () => void;
  generating?: boolean;
  checkoutUrl?: string;
};

export function PlanCard({
  recommendation,
  goal,
  supportLevel,
  cookingPreference,
  onGenerate,
  generating,
  checkoutUrl,
}: PlanCardProps) {
  const planName = recommendation?.recommended_plan;
  const program = recommendation?.program || deriveProgram(goal);
  const variant = recommendation?.variant || deriveVariant(supportLevel, cookingPreference);
  const displayTitle = planName || (program ? `${program} — ${variant}` : "Plan not ready yet");
  const bullets = buildBullets(program, variant, goal);

  return (
    <div className="rounded-2xl border border-orange-200/70 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/70 p-5 shadow-sm dark:border-orange-900/40 dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-900/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-orange-500 dark:text-orange-300">
            Recommended plan
          </p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
            {displayTitle}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Built from your goal, support needs, and kitchen setup.
          </p>
        </div>
        <Sparkles className="h-5 w-5 text-orange-500 dark:text-orange-300" aria-hidden />
      </div>

      <ul className="mt-4 grid gap-2 text-sm text-slate-700 dark:text-slate-200">
        {bullets.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-200/70 bg-white/80 px-3 py-2 text-left shadow-sm dark:border-orange-900/40 dark:bg-slate-900/70"
          >
            <ShieldCheck className="h-4 w-4 text-orange-500" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={generating}
          onClick={onGenerate}
          className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {planName ? "Refresh recommendation" : "Generate my plan"}
        </button>
        {checkoutUrl ? (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noreferrer"
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
              "border-slate-300 text-slate-800 hover:border-orange-400 hover:text-orange-600 dark:border-slate-700 dark:text-slate-100 dark:hover:border-orange-300 dark:hover:text-orange-200",
            )}
          >
            Start {program || "your plan"}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function deriveProgram(goal?: string | null) {
  const normalized = goal?.toLowerCase();
  if (!normalized) return undefined;
  if (normalized.includes("muscle")) return "Beast";
  return "Shred";
}

function deriveVariant(supportLevel?: number | null, cookingPreference?: boolean | null) {
  const support = supportLevel ?? 1;
  if (support >= 4 || cookingPreference === false) return "Gladiator";
  return "Spartan";
}

function buildBullets(program?: string, variant?: string, goal?: string | null) {
  const core = [
    program === "Beast" ? "Lean mass focused macros" : "Aggressive fat-loss pacing",
    variant === "Gladiator" ? "High-touch coaching and accountability" : "Simplified routines for busy schedules",
  ];

  if (goal?.toLowerCase().includes("recomp")) {
    core.push("Balances strength and conditioning to recomposition");
  } else if (goal?.toLowerCase().includes("muscle")) {
    core.push("Progressive overload + recovery guidance");
  } else {
    core.push("Cravings control and hydration cadence");
  }

  return core;
}
