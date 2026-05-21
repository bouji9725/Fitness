import Card from "@frontend/components/ui/Card";
import type { MacroTarget, MealBreakdownPlan } from "@shared/types/nutrition";

const STRUCTURE_LABELS: Record<string, string> = {
  "3-meals": "3 Meals",
  "3-meals-1-snack": "3 Meals + 1 Snack",
  "3-meals-2-snacks": "3 Meals + 2 Snacks",
  "2-meals-1-snack": "2 Meals + 1 Snack",
  "intermittent-fasting-16-8": "Intermittent Fasting (16:8)",
  "training-day-split": "Training Day Split",
  "rest-day-split": "Rest Day Split",
};

function MacroPills({ target }: { target: MacroTarget }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-medium text-indigo-200">
        P {target.proteinGrams}g
      </span>
      <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-200">
        C {target.carbsGrams}g
      </span>
      <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-medium text-rose-200">
        F {target.fatGrams}g
      </span>
    </div>
  );
}

type Props = {
  plan: MealBreakdownPlan;
};

export default function MealBreakdownGrid({ plan }: Props) {
  const structureLabel = STRUCTURE_LABELS[plan.structure] ?? plan.structure;
  const dayLabel = plan.dayType === "training" ? "Training day" : "Rest day";

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Meal breakdown
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          {structureLabel}
        </h3>
        <p className="mt-1 text-sm text-slate-400">{dayLabel}</p>
      </div>

      <div className="space-y-3">
        {plan.slots.map((slot) => (
          <div
            key={slot.index}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{slot.name}</p>
                {slot.timeLabel && (
                  <p className="mt-0.5 text-xs text-slate-400">{slot.timeLabel}</p>
                )}
              </div>
              <p className="shrink-0 text-sm font-semibold text-white">
                {slot.target.calories} kcal
              </p>
            </div>
            <div className="mt-2.5">
              <MacroPills target={slot.target} />
            </div>
          </div>
        ))}
      </div>

      {/* Daily totals */}
      <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-indigo-100">Daily total</p>
          <p className="text-sm font-semibold text-white">
            {plan.dailyTarget.calories} kcal
          </p>
        </div>
        <div className="mt-2.5">
          <MacroPills target={plan.dailyTarget} />
        </div>
      </div>
    </Card>
  );
}
