import clsx from "clsx";
import { Phone, ShieldCheck } from "lucide-react";

type HandoffBannerProps = {
  reason?: string | null;
  onContinue?: () => void;
};

export function HandoffBanner({ reason, onContinue }: HandoffBannerProps) {
  return (
    <div className="rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/40">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden />
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">VIP Concierge handoff</p>
            {reason ? (
              <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/60 dark:text-amber-100">
                {reason}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-amber-900/90 dark:text-amber-100/90">
            Want a human right now? Text our VIP Client Concierge. Otherwise, tell the coach what’s going on and we’ll pass it to the team.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="sms:+18555551234"
              className={clsx(
                "inline-flex items-center gap-2 rounded-full bg-amber-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition",
                "hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
              )}
            >
              <Phone className="h-4 w-4" aria-hidden />
              Text VIP Concierge
            </a>
            <button
              type="button"
              onClick={onContinue}
              className="rounded-full border border-amber-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-amber-800 transition hover:border-amber-400 hover:text-amber-900 dark:border-amber-800 dark:text-amber-100 dark:hover:border-amber-700"
            >
              Keep chatting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
