import { useState } from "react";
import { Loader2, MessageCircleWarning } from "lucide-react";
import clsx from "clsx";

const DEFAULT_OBJECTIONS = ["Price", "Time", "Taste", "Results", "I want to talk to a human"];

type ObjectionCaptureProps = {
  value?: string | null;
  onSubmit: (value: string) => Promise<void> | void;
};

export function ObjectionCapture({ value, onSubmit }: ObjectionCaptureProps) {
  const [selected, setSelected] = useState<string | null>(value ?? null);
  const [custom, setCustom] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (objection: string) => {
    setSelected(objection);
    setSubmitting(true);
    await Promise.resolve(onSubmit(objection));
    setSubmitting(false);
  };

  const handleCustomSubmit = async () => {
    if (!custom.trim()) return;
    await handleSubmit(custom.trim());
    setCustom("");
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
        <MessageCircleWarning className="h-4 w-4 text-amber-500" aria-hidden />
        Objections
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Capture what’s holding the user back so the agent can handle it or hand off.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {DEFAULT_OBJECTIONS.map((label) => {
          const active = selected === label;
          return (
            <button
              key={label}
              type="button"
              disabled={submitting}
              onClick={() => handleSubmit(label)}
              className={clsx(
                "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
                active
                  ? "border-amber-400 bg-amber-100 text-amber-800 shadow-sm dark:border-amber-500 dark:bg-amber-900/40 dark:text-amber-100"
                  : "border-slate-300 bg-white text-slate-700 hover:border-amber-400 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-200",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Custom objection"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-amber-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="button"
          disabled={submitting || !custom.trim()}
          onClick={handleCustomSubmit}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Save
        </button>
      </div>
    </div>
  );
}
