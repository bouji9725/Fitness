"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@frontend/components/ui/Card";
import Skeleton from "@frontend/components/ui/Skeleton";
import { getNutritionSummary } from "@frontend/api/nutrition-api";
import { listMealLogs } from "@frontend/api/meal-api";
import type { MealLogEntry, NutritionResults } from "@shared/types/nutrition";

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type MiniBarProps = {
  label: string;
  actual: number;
  target: number;
  unit: string;
  fillColor: string;
};

function MiniBar({ label, actual, target, unit, fillColor }: MiniBarProps) {
  const pct = target > 0 ? Math.min((actual / target) * 100, 100) : 0;
  const over = actual > target;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className={over ? "font-semibold text-red-300" : "text-slate-300"}>
          {Math.round(actual)}<span className="text-slate-500">/{target} {unit}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/60">
        <div
          className={`h-full rounded-full transition-all duration-300 ${over ? "bg-red-400" : fillColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function TodayNutritionCard() {
  const today = useMemo(todayString, []);
  const [nutrition, setNutrition] = useState<NutritionResults | null>(null);
  const [logs, setLogs] = useState<MealLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getNutritionSummary().catch(() => null),
      listMealLogs(today).catch(() => [] as MealLogEntry[]),
    ]).then(([nutr, entries]) => {
      if (!cancelled) {
        setNutrition(nutr);
        setLogs(entries);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [today]);

  if (loading) return <Skeleton className="h-44" />;
  if (!nutrition) return null;

  const actual = logs.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.proteinGrams,
      carbs: acc.carbs + e.carbsGrams,
      fat: acc.fat + e.fatGrams,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Today
          </p>
          <h3 className="mt-2 text-base font-semibold text-white">Nutrition</h3>
        </div>
        <Link
          href="/nutrition"
          className="mt-1 text-xs text-indigo-300 hover:text-indigo-200 transition"
        >
          View plan →
        </Link>
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-slate-400">
          No meals logged yet.{" "}
          <Link href="/nutrition" className="text-indigo-300 hover:text-indigo-200 transition">
            Log your first meal
          </Link>
        </p>
      ) : (
        <div className="space-y-2.5">
          <MiniBar
            label="Calories"
            actual={actual.calories}
            target={nutrition.calorieTarget}
            unit="kcal"
            fillColor="bg-indigo-400"
          />
          <MiniBar
            label="Protein"
            actual={actual.protein}
            target={nutrition.proteinTargetGrams}
            unit="g"
            fillColor="bg-indigo-400"
          />
          <MiniBar
            label="Carbs"
            actual={actual.carbs}
            target={nutrition.carbsTargetGrams}
            unit="g"
            fillColor="bg-amber-400"
          />
          <MiniBar
            label="Fat"
            actual={actual.fat}
            target={nutrition.fatTargetGrams}
            unit="g"
            fillColor="bg-rose-400"
          />
        </div>
      )}
    </Card>
  );
}
