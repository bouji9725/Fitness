"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@frontend/components/ui/Card";
import Skeleton from "@frontend/components/ui/Skeleton";
import { getMealPreference, listMealLogs } from "@frontend/api/meal-api";
import { getNutritionSummary } from "@frontend/api/nutrition-api";
import { distributeMacrosToMeals } from "@shared/calculations/nutrition";
import MealStructurePicker from "./MealStructurePicker";
import MealBreakdownGrid from "./MealBreakdownGrid";
import DailyMacroProgress from "./DailyMacroProgress";
import MealLogForm from "./MealLogForm";
import type {
  MacroTarget,
  MealBreakdownPlan,
  MealLogEntry,
  MealPreference,
} from "@shared/types/nutrition";
import type { NutritionResults } from "@shared/types/nutrition";

function todayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toMacroTarget(r: NutritionResults): MacroTarget {
  return {
    calories: r.calorieTarget,
    proteinGrams: r.proteinTargetGrams,
    carbsGrams: r.carbsTargetGrams,
    fatGrams: r.fatTargetGrams,
  };
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-72" />
      <div className="space-y-6 lg:col-span-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

export default function MealBreakdownSection() {
  const today = useMemo(todayString, []);

  const [nutrition, setNutrition] = useState<NutritionResults | null>(null);
  const [preference, setPreference] = useState<MealPreference | null>(null);
  const [logs, setLogs] = useState<MealLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSlot, setOpenSlot] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [nutr, pref, entries] = await Promise.all([
        getNutritionSummary().catch(() => null),
        getMealPreference().catch(() => null),
        listMealLogs(today).catch(() => [] as MealLogEntry[]),
      ]);
      if (!cancelled) {
        setNutrition(nutr);
        setPreference(pref);
        setLogs(entries);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [today]);

  const plan = useMemo<MealBreakdownPlan | null>(() => {
    if (!nutrition || !preference) return null;
    return distributeMacrosToMeals(
      toMacroTarget(nutrition),
      preference.structure,
      preference.dayType,
      {
        workoutTime: preference.workoutTime,
        fastingWindowStart: preference.fastingWindowStart,
      }
    );
  }, [nutrition, preference]);

  function handleLogSaved(entry: MealLogEntry) {
    setLogs((prev) => {
      const idx = prev.findIndex((l) => l.slotIndex === entry.slotIndex);
      return idx >= 0
        ? prev.map((l, i) => (i === idx ? entry : l))
        : [...prev, entry].sort((a, b) => a.slotIndex - b.slotIndex);
    });
    setOpenSlot(null);
  }

  function handleLogDeleted(slotIndex: number) {
    setLogs((prev) => prev.filter((l) => l.slotIndex !== slotIndex));
    setOpenSlot(null);
  }

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Meal breakdown
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Daily meal plan
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Set your eating schedule and log meals as you go.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Picker — left column */}
        <div>
          <MealStructurePicker
            initialPreference={preference}
            onSaved={(pref) => {
              setPreference(pref);
              setOpenSlot(null);
            }}
          />
        </div>

        {/* Main content — right two columns */}
        <div className="space-y-6 lg:col-span-2">
          {!nutrition ? (
            <Card>
              <p className="text-sm text-slate-400">
                Complete the nutrition calculator above to see your meal breakdown.
              </p>
            </Card>
          ) : !preference ? (
            <Card>
              <p className="text-sm text-slate-400">
                Choose a meal structure on the left to get started.
              </p>
            </Card>
          ) : plan ? (
            <>
              <DailyMacroProgress dailyTarget={plan.dailyTarget} logs={logs} />

              <MealBreakdownGrid plan={plan} />

              {/* Interactive log list */}
              <Card className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300 pb-1">
                  Log meals
                </p>

                {plan.slots.map((slot) => {
                  const existing = logs.find((l) => l.slotIndex === slot.index) ?? null;
                  const isOpen = openSlot === slot.index;

                  return (
                    <div key={slot.index}>
                      {/* Slot row */}
                      <button
                        onClick={() => setOpenSlot(isOpen ? null : slot.index)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white">{slot.name}</p>
                            {slot.timeLabel && (
                              <p className="text-xs text-slate-400">{slot.timeLabel}</p>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            {existing ? (
                              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                                {existing.calories} kcal logged
                              </span>
                            ) : (
                              <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
                                Not logged
                              </span>
                            )}
                            <span className="text-xs text-slate-500">
                              {isOpen ? "▲" : "▼"}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Expanded form */}
                      {isOpen && (
                        <div className="mt-2 rounded-2xl border border-white/10 bg-white/3 px-4 py-4">
                          <MealLogForm
                            date={today}
                            slot={slot}
                            existingEntry={existing}
                            onSaved={handleLogSaved}
                            onDeleted={() => handleLogDeleted(slot.index)}
                            onCancel={() => setOpenSlot(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
