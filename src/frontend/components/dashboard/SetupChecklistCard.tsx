import Link from "next/link";
import Card from "@frontend/components/ui/Card";

type ChecklistItem = {
  label: string;
  description: string;
  done: boolean;
  href: string;
};

type Props = {
  hasProfile: boolean;
  hasProgressEntry: boolean;
  hasNutritionPlan: boolean;
  hasWorkout: boolean;
  hasSharingEnabled: boolean;
};

export default function SetupChecklistCard({
  hasProfile,
  hasProgressEntry,
  hasNutritionPlan,
  hasWorkout,
  hasSharingEnabled,
}: Props) {
  const items: ChecklistItem[] = [
    {
      label: "Complete your profile",
      description: "Add name, age, sex, and height",
      done: hasProfile,
      href: "/profile",
    },
    {
      label: "Add a progress entry",
      description: "Log your first weight and body fat check-in",
      done: hasProgressEntry,
      href: "/progress",
    },
    {
      label: "Calculate nutrition plan",
      description: "Set your calorie and macro targets",
      done: hasNutritionPlan,
      href: "/nutrition",
    },
    {
      label: "Complete a workout",
      description: "Save your first training session",
      done: hasWorkout,
      href: "/workouts",
    },
    {
      label: "Enable coach sharing",
      description: "Prepare your data for coach review",
      done: hasSharingEnabled,
      href: "/profile",
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Setup
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            {allDone ? "You're all set" : "Getting started"}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {allDone
              ? "All key sections are complete. Keep tracking."
              : "Complete these steps to get the most out of Fitsler."}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-white">
            {doneCount}
            <span className="text-sm font-normal text-slate-400">
              /{items.length}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-slate-400">done</p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={[
              "flex items-center gap-4 rounded-2xl border px-4 py-3 text-sm transition",
              item.done
                ? "border-emerald-400/20 bg-emerald-500/10 cursor-default pointer-events-none"
                : "border-white/10 bg-white/5 hover:bg-white/10",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                item.done
                  ? "border-emerald-400 bg-emerald-400/20"
                  : "border-slate-600",
              ].join(" ")}
            >
              {item.done && (
                <svg
                  className="h-2.5 w-2.5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                  <path
                    d="M1.5 5l2.5 2.5 4.5-4.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={
                  item.done
                    ? "text-slate-400 line-through"
                    : "font-medium text-slate-200"
                }
              >
                {item.label}
              </p>
              {!item.done && (
                <p className="text-xs text-slate-400">{item.description}</p>
              )}
            </div>
            {!item.done && (
              <svg
                className="h-4 w-4 shrink-0 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </Link>
        ))}
      </div>
    </Card>
  );
}
