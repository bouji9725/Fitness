"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@frontend/components/ui/Card";
import Skeleton from "@frontend/components/ui/Skeleton";
import { getMealPreference, listMealLogs } from "@frontend/api/meal-api";
import { getNutritionSummary } from "@frontend/api/nutrition-api";
import { getDailyTargetOverride, saveDailyTargetOverride, deleteDailyTargetOverride } from "@frontend/api/daily-target-override-api";
import { hasWorkoutSessionForDate } from "@frontend/api/workouts-api";
import { distributeMacrosToMeals } from "@shared/calculations/nutrition";
import { useToast } from "@frontend/context/ToastContext";
import MealStructurePicker from "./MealStructurePicker";
import MealBreakdownGrid from "./MealBreakdownGrid";
import DailyMacroProgress from "./DailyMacroProgress";
import MealLogForm from "./MealLogForm";
import FastingCountdown from "./FastingCountdown";
import type {
  DailyTargetOverride,
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

function toMacroTarget(r: NutritionResults, override: DailyTargetOverride | null): MacroTarget {
  return {
    calories: override?.calories ?? r.calorieTarget,
    proteinGrams: override?.proteinGrams ?? r.proteinTargetGrams,
    carbsGrams: override?.carbsGrams ?? r.carbsTargetGrams,
    fatGrams: override?.fatGrams ?? r.fatTargetGrams,
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

type OverrideFormState = {
  calories: string;
  proteinGrams: string;
  carbsGrams: string;
  fatGrams: string;
};

function toOverrideFormState(
  override: DailyTargetOverride | null,
  base: NutritionResults
): OverrideFormState {
  return {
    calories: String(override?.calories ?? base.calorieTarget),
    proteinGrams: String(override?.proteinGrams ?? base.proteinTargetGrams),
    carbsGrams: String(override?.carbsGrams ?? base.carbsTargetGrams),
    fatGrams: String(override?.fatGrams ?? base.fatTargetGrams),
  };
}

export default function MealBreakdownSection() {
  const today = useMemo(todayString, []);
  const { toast } = useToast();

  const [nutrition, setNutrition] = useState<NutritionResults | null>(null);
  const [preference, setPreference] = useState<MealPreference | null>(null);
  const [logs, setLogs] = useState<MealLogEntry[]>([]);
  const [override, setOverride] = useState<DailyTargetOverride | null>(null);
  const [trainingDayDetected, setTrainingDayDetected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideFields, setOverrideFields] = useState<OverrideFormState>({
    calories: "", proteinGrams: "", carbsGrams: "", fatGrams: "",
  });
  const [savingOverride, setSavingOverride] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [nutr, pref, entries, ov, isTraining] = await Promise.all([
        getNutritionSummary().catch(() => null),
        getMealPreference().catch(() => null),
        listMealLogs(today).catch(() => [] as MealLogEntry[]),
        getDailyTargetOverride(today).catch(() => null),
        hasWorkoutSessionForDate(today).catch(() => false),
      ]);
      if (!cancelled) {
        setNutrition(nutr);
        setPreference(pref);
        setLogs(entries);
        setOverride(ov);
        setTrainingDayDetected(isTraining);
        if (nutr) {
          setOverrideFields(toOverrideFormState(ov, nutr));
        }
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [today]);

  const effectiveTarget = useMemo<MacroTarget | null>(() => {
    if (!nutrition) return null;
    return toMacroTarget(nutrition, override);
  }, [nutrition, override]);

  const plan = useMemo<MealBreakdownPlan | null>(() => {
    if (!effectiveTarget || !preference) return null;
    return distributeMacrosToMeals(
      effectiveTarget,
      preference.structure,
      preference.dayType,
      {
        workoutTime: preference.workoutTime,
        fastingWindowStart: preference.fastingWindowStart,
      }
    );
  }, [effectiveTarget, preference]);

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

  async function handleSaveOverride() {
    if (!nutrition) return;
    setSavingOverride(true);
    try {
      const data = {
        calories: parseFloat(overrideFields.calories) || undefined,
        proteinGrams: parseFloat(overrideFields.proteinGrams) || undefined,
        carbsGrams: parseFloat(overrideFields.carbsGrams) || undefined,
        fatGrams: parseFloat(overrideFields.fatGrams) || undefined,
      };
      const saved = await saveDailyTargetOverride(today, data);
      setOverride(saved);
      setShowOverrideForm(false);
      toast("Today's targets updated.", "success");
    } catch {
      toast("Failed to save override.", "error");
    } finally {
      setSavingOverride(false);
    }
  }

  async function handleResetOverride() {
    setSavingOverride(true);
    try {
      await deleteDailyTargetOverride(today);
      setOverride(null);
      if (nutrition) setOverrideFields(toOverrideFormState(null, nutrition));
      setShowOverrideForm(false);
      toast("Targets reset to saved plan.", "success");
    } catch {
      toast("Failed to reset targets.", "error");
    } finally {
      setSavingOverride(false);
    }
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
        <div className="space-y-4">
          <MealStructurePicker
            initialPreference={preference}
            onSaved={(pref) => {
              setPreference(pref);
              setOpenSlot(null);
            }}
          />

          {/* Training day auto-detect badge */}
          {trainingDayDetected && (
            <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3">
              <p className="text-sm font-medium text-indigo-200">Training day detected</p>
              <p className="mt-0.5 text-xs text-indigo-300/70">
                You have a workout session today.
              </p>
            </div>
          )}
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
              {/* Fasting countdown */}
              {preference.structure === "intermittent-fasting-16-8" && preference.fastingWindowStart && (
                <FastingCountdown fastingWindowStart={preference.fastingWindowStart} />
              )}

              {/* Today's target override */}
              <Card className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                      Today's targets
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        { label: "Cal", value: plan.dailyTarget.calories, unit: "kcal" },
                        { label: "P", value: plan.dailyTarget.proteinGrams, unit: "g" },
                        { label: "C", value: plan.dailyTarget.carbsGrams, unit: "g" },
                        { label: "F", value: plan.dailyTarget.fatGrams, unit: "g" },
                      ].map(({ label, value, unit }) => (
                        <span key={label} className="text-sm text-slate-300">
                          <span className="font-medium text-white">{value}</span>
                          <span className="text-slate-500"> {unit} {label}</span>
                        </span>
                      ))}
                    </div>
                    {override && (
                      <p className="mt-1 text-xs text-amber-300">Overriding saved plan for today</p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {override && (
                      <button
                        onClick={handleResetOverride}
                        disabled={savingOverride}
                        className="text-xs text-slate-400 hover:text-slate-200 transition disabled:opacity-50"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (nutrition) setOverrideFields(toOverrideFormState(override, nutrition));
                        setShowOverrideForm((v) => !v);
                      }}
                      className="text-xs text-indigo-300 hover:text-indigo-200 transition"
                    >
                      {showOverrideForm ? "Cancel" : "Adjust"}
                    </button>
                  </div>
                </div>

                {showOverrideForm && (
                  <div className="space-y-3 border-t border-white/10 pt-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {(["calories", "proteinGrams", "carbsGrams", "fatGrams"] as const).map((field) => {
                        const labels = { calories: "Calories (kcal)", proteinGrams: "Protein (g)", carbsGrams: "Carbs (g)", fatGrams: "Fat (g)" };
                        return (
                          <div key={field} className="flex flex-col gap-1.5">
                            <label className="text-xs text-slate-400">{labels[field]}</label>
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={overrideFields[field]}
                              onChange={(e) => setOverrideFields((prev) => ({ ...prev, [field]: e.target.value }))}
                              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-indigo-400/50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={handleSaveOverride}
                      disabled={savingOverride}
                      className="w-full rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingOverride ? "Saving…" : "Apply override"}
                    </button>
                  </div>
                )}
              </Card>

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
                            <span className="text-xs text-slate-500">{isOpen ? "▲" : "▼"}</span>
                          </div>
                        </div>
                      </button>

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
