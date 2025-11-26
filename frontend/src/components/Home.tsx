import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";

import { ChatKitPanel } from "./ChatKitPanel";
import { CustomerContextPanel } from "./CustomerContextPanel";
import { ThemeToggle } from "./ThemeToggle";
import { useCustomerContext } from "../hooks/useCustomerContext";
import type { ColorScheme } from "../hooks/useColorScheme";

const BG_GRADIENT = "from-orange-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900";

export default function Home({ scheme, onThemeChange }: { scheme: ColorScheme; onThemeChange: (scheme: ColorScheme) => void }) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const { profile, loading, saving, error, refresh, recommendPlan, saveProfile } = useCustomerContext(threadId);
  const [recommending, setRecommending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const containerClass = clsx(
    "min-h-screen bg-gradient-to-br transition-colors duration-300",
    BG_GRADIENT,
    scheme === "dark" ? "text-slate-100" : "text-slate-900",
  );

  const handleThreadChange = useCallback((nextThreadId: string | null) => {
    setThreadId(nextThreadId);
  }, []);

  const handleResponseCompleted = useCallback(() => {
    void refresh();
  }, [refresh]);

  const handleRecommendPlan = useCallback(async () => {
    setRecommending(true);
    setStatus(null);
    try {
      await recommendPlan(profile ?? {});
      setStatus("Plan refreshed");
      void refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not generate plan");
    } finally {
      setRecommending(false);
    }
  }, [profile, recommendPlan, refresh]);

  const handleObjectionSave = useCallback(
    async (value: string) => {
      await saveProfile({ objection: value });
      setStatus("Objection captured");
    },
    [saveProfile],
  );

  const welcomeLine = useMemo(() => {
    if (!profile) return "Your AI sales coach for Nutrition Solutions";
    if (profile.returning_user) return "Welcome back — we’ll pick up where you left off.";
    return "Let’s build your Nutrition Solutions plan.";
  }, [profile]);

  return (
    <div className={containerClass}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:h-screen lg:max-h-screen lg:py-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 dark:text-orange-300">Nutrition Solutions</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">AI Sales Coach</h1>
            <p className="max-w-3xl text-sm text-slate-700 dark:text-slate-300">{welcomeLine}</p>
            {status ? <p className="text-xs uppercase tracking-wide text-orange-500">{status}</p> : null}
          </div>
          <ThemeToggle value={scheme} onChange={onThemeChange} />
        </header>

        <div className="grid flex-1 grid-cols-1 gap-8 lg:h-[calc(100vh-220px)] lg:grid-cols-[minmax(360px,420px)_1fr] lg:items-stretch xl:grid-cols-[minmax(400px,440px)_1fr]">
          <section className="flex flex-1 flex-col overflow-hidden rounded-3xl bg-white/85 shadow-[0_45px_90px_-45px_rgba(15,23,42,0.6)] ring-1 ring-slate-200/60 backdrop-blur dark:bg-slate-900/80 dark:shadow-[0_45px_90px_-45px_rgba(15,23,42,0.85)] dark:ring-slate-800/60">
            <div className="flex flex-1">
              <ChatKitPanel
                theme={scheme}
                onThreadChange={handleThreadChange}
                onResponseCompleted={handleResponseCompleted}
              />
            </div>
          </section>

          <CustomerContextPanel
            profile={profile}
            loading={loading}
            error={error}
            onRecommendPlan={handleRecommendPlan}
            recommending={recommending || saving}
            onSaveObjection={handleObjectionSave}
          />
        </div>
      </div>
    </div>
  );
}
