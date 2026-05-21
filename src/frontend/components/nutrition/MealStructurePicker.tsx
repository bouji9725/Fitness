"use client";

import { useState } from "react";
import Card from "@frontend/components/ui/Card";
import Select from "@frontend/components/ui/Select";
import Input from "@frontend/components/ui/Input";
import FormField from "@frontend/components/ui/FormField";
import { saveMealPreference } from "@frontend/api/meal-api";
import { useToast } from "@frontend/context/ToastContext";
import type { DayType, MealPreference, MealStructure } from "@shared/types/nutrition";

const STRUCTURE_OPTIONS: { value: MealStructure; label: string }[] = [
  { value: "3-meals", label: "3 Meals" },
  { value: "3-meals-1-snack", label: "3 Meals + 1 Snack" },
  { value: "3-meals-2-snacks", label: "3 Meals + 2 Snacks" },
  { value: "2-meals-1-snack", label: "2 Meals + 1 Snack" },
  { value: "intermittent-fasting-16-8", label: "Intermittent Fasting (16:8)" },
  { value: "training-day-split", label: "Training Day Split" },
  { value: "rest-day-split", label: "Rest Day Split" },
];

const TIME_RE = /^\d{2}:\d{2}$/;

function validateTime(value: string): string | undefined {
  if (!value) return undefined;
  return TIME_RE.test(value) ? undefined : "Enter a valid time (HH:MM).";
}

type Props = {
  initialPreference: MealPreference | null;
  onSaved: (pref: MealPreference) => void;
};

export default function MealStructurePicker({ initialPreference, onSaved }: Props) {
  const { toast } = useToast();

  const [structure, setStructure] = useState<MealStructure>(
    initialPreference?.structure ?? "3-meals"
  );
  const [dayType, setDayType] = useState<DayType>(
    initialPreference?.dayType ?? "training"
  );
  const [workoutTime, setWorkoutTime] = useState(
    initialPreference?.workoutTime ?? ""
  );
  const [fastingStart, setFastingStart] = useState(
    initialPreference?.fastingWindowStart ?? ""
  );
  const [saving, setSaving] = useState(false);

  const showWorkoutTime = structure === "training-day-split";
  const showFastingStart = structure === "intermittent-fasting-16-8";

  const workoutTimeError = showWorkoutTime ? validateTime(workoutTime) : undefined;
  const fastingStartError = showFastingStart ? validateTime(fastingStart) : undefined;
  const hasErrors = !!workoutTimeError || !!fastingStartError;

  async function handleSave() {
    if (hasErrors) return;

    const pref: MealPreference = {
      structure,
      dayType,
      workoutTime: showWorkoutTime && workoutTime ? workoutTime : undefined,
      fastingWindowStart: showFastingStart && fastingStart ? fastingStart : undefined,
    };

    setSaving(true);
    try {
      const saved = await saveMealPreference(pref);
      onSaved(saved);
      toast("Meal structure saved.", "success");
    } catch {
      toast("Failed to save meal structure.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Meal structure
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Eating schedule
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Choose how to split your daily targets across meals.
        </p>
      </div>

      <div className="space-y-4">
        <FormField label="Structure" htmlFor="meal-structure">
          <Select
            id="meal-structure"
            value={structure}
            onChange={(e) => setStructure(e.target.value as MealStructure)}
          >
            {STRUCTURE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Day type" htmlFor="meal-day-type">
          <Select
            id="meal-day-type"
            value={dayType}
            onChange={(e) => setDayType(e.target.value as DayType)}
          >
            <option value="training">Training day</option>
            <option value="rest">Rest day</option>
          </Select>
        </FormField>

        {showWorkoutTime && (
          <FormField
            label="Workout time (optional)"
            htmlFor="meal-workout-time"
            error={workoutTimeError}
          >
            <Input
              id="meal-workout-time"
              type="time"
              value={workoutTime}
              onChange={(e) => setWorkoutTime(e.target.value)}
              hasError={!!workoutTimeError}
              placeholder="HH:MM"
            />
          </FormField>
        )}

        {showFastingStart && (
          <FormField
            label="Eating window start (optional)"
            htmlFor="meal-fasting-start"
            error={fastingStartError}
          >
            <Input
              id="meal-fasting-start"
              type="time"
              value={fastingStart}
              onChange={(e) => setFastingStart(e.target.value)}
              hasError={!!fastingStartError}
              placeholder="HH:MM"
            />
          </FormField>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving || hasErrors}
        className="w-full rounded-2xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save structure"}
      </button>
    </Card>
  );
}
