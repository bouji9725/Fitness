import Card from "@frontend/components/ui/Card";
import type { MacroTarget, MealLogEntry } from "@shared/types/nutrition";

type MacroRow = {
  label: string;
  unit: string;
  actual: number;
  target: number;
  trackColor: string;
  fillColor: string;
  overColor: string;
};

function sumLogs(logs: MealLogEntry[]): MacroTarget {
  return logs.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      proteinGrams: acc.proteinGrams + e.proteinGrams,
      carbsGrams: acc.carbsGrams + e.carbsGrams,
      fatGrams: acc.fatGrams + e.fatGrams,
    }),
    { calories: 0, proteinGrams: 0, carbsGrams: 0, fatGrams: 0 }
  );
}

function ProgressRow({ label, unit, actual, target, trackColor, fillColor, overColor }: MacroRow) {
  const pct = target > 0 ? Math.min((actual / target) * 100, 100) : 0;
  const over = actual > target;
  const remaining = target - actual;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className="text-sm text-slate-300">
          <span className={over ? "text-red-300 font-semibold" : ""}>{Math.round(actual)}</span>
          <span className="text-slate-500"> / {target} {unit}</span>
        </span>
      </div>

      {/* Track */}
      <div className={`h-2 w-full overflow-hidden rounded-full ${trackColor}`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${over ? overColor : fillColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs text-slate-500">
        {over
          ? `${Math.round(actual - target)} ${unit} over target`
          : `${Math.round(remaining)} ${unit} remaining`}
      </p>
    </div>
  );
}

type Props = {
  dailyTarget: MacroTarget;
  logs: MealLogEntry[];
};

export default function DailyMacroProgress({ dailyTarget, logs }: Props) {
  const actual = sumLogs(logs);

  const rows: MacroRow[] = [
    {
      label: "Calories",
      unit: "kcal",
      actual: actual.calories,
      target: dailyTarget.calories,
      trackColor: "bg-slate-700/60",
      fillColor: "bg-indigo-400",
      overColor: "bg-red-400",
    },
    {
      label: "Protein",
      unit: "g",
      actual: actual.proteinGrams,
      target: dailyTarget.proteinGrams,
      trackColor: "bg-slate-700/60",
      fillColor: "bg-indigo-400",
      overColor: "bg-red-400",
    },
    {
      label: "Carbs",
      unit: "g",
      actual: actual.carbsGrams,
      target: dailyTarget.carbsGrams,
      trackColor: "bg-slate-700/60",
      fillColor: "bg-amber-400",
      overColor: "bg-red-400",
    },
    {
      label: "Fat",
      unit: "g",
      actual: actual.fatGrams,
      target: dailyTarget.fatGrams,
      trackColor: "bg-slate-700/60",
      fillColor: "bg-rose-400",
      overColor: "bg-red-400",
    },
  ];

  const logsCount = logs.length;

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Today
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Daily progress
          </h3>
        </div>
        <p className="mt-3 text-sm text-slate-400">
          {logsCount === 0
            ? "No meals logged yet"
            : `${logsCount} meal${logsCount === 1 ? "" : "s"} logged`}
        </p>
      </div>

      <div className="space-y-4">
        {rows.map((row) => (
          <ProgressRow key={row.label} {...row} />
        ))}
      </div>
    </Card>
  );
}
