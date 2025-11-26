import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

export type TestimonialItem = {
  id: string;
  name: string;
  goal: string;
  gender?: string | null;
  age_bracket?: string | null; // "<=30" | "31-45" | "46+"
  result: string;
  blurb: string;
};

type TransformationCarouselProps = {
  items: TestimonialItem[];
  goal?: string | null;
  gender?: string | null;
  age_bracket?: string | null;
  onSelect?: (id: string) => void;
};

export function TransformationCarousel({ items, goal, gender, age_bracket, onSelect }: TransformationCarouselProps) {
  const filtered = useMemo(() => {
    const matchesAll = items.filter((item) => matches(item, goal, gender, age_bracket));
    if (matchesAll.length >= 3) return matchesAll;
    const goalMatches = items.filter((item) => matches(item, goal, null, null));
    if (goalMatches.length >= 3) return goalMatches;
    return items.slice(0, 3);
  }, [items, goal, gender, age_bracket]);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Transformations</p>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Real client wins</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Filtered by your goal{goal ? ` (${goal.replace("_", " ")})` : ""}.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="group flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 via-white to-slate-100/80 p-3 shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                <span>{item.goal.replace("_", " ")}</span>
                {item.age_bracket ? <span>{item.age_bracket}</span> : null}
              </div>
              <h4 className="text-base font-semibold text-slate-900 dark:text-slate-50">{item.name}</h4>
              <p className="text-sm font-semibold text-orange-600 dark:text-orange-300">{item.result}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{item.blurb}</p>
            </div>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={clsx(
                  "inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
                  "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:hover:bg-orange-900/60",
                )}
              >
                Use this example <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

function matches(item: TestimonialItem, goal?: string | null, gender?: string | null, age_bracket?: string | null) {
  const goalMatch = goal ? item.goal === goal : true;
  const genderMatch = gender ? (item.gender ?? "").toLowerCase() === gender.toLowerCase() : true;
  const ageMatch = age_bracket ? item.age_bracket === age_bracket : true;
  return goalMatch && genderMatch && ageMatch;
}
