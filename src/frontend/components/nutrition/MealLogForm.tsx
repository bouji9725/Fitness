"use client";

import { useState } from "react";
import Button from "@frontend/components/ui/Button";
import FormField from "@frontend/components/ui/FormField";
import Input from "@frontend/components/ui/Input";
import { saveMealLog, deleteMealLog } from "@frontend/api/meal-api";
import { useToast } from "@frontend/context/ToastContext";
import type { MealLogEntry, MealSlot } from "@shared/types/nutrition";

type Props = {
  date: string;
  slot: MealSlot;
  existingEntry: MealLogEntry | null;
  onSaved: (entry: MealLogEntry) => void;
  onDeleted: () => void;
  onCancel: () => void;
};

type Fields = {
  calories: string;
  proteinGrams: string;
  carbsGrams: string;
  fatGrams: string;
  notes: string;
};

type FieldErrors = Partial<Record<keyof Omit<Fields, "notes">, string>>;

function toFields(entry: MealLogEntry | null): Fields {
  if (!entry) return { calories: "", proteinGrams: "", carbsGrams: "", fatGrams: "", notes: "" };
  return {
    calories: String(entry.calories),
    proteinGrams: String(entry.proteinGrams),
    carbsGrams: String(entry.carbsGrams),
    fatGrams: String(entry.fatGrams),
    notes: entry.notes ?? "",
  };
}

function validateFields(f: Fields): FieldErrors {
  const errors: FieldErrors = {};
  const check = (key: keyof FieldErrors, label: string) => {
    const v = parseFloat(f[key]);
    if (f[key] === "" || isNaN(v) || v < 0) {
      errors[key] = `${label} must be 0 or more.`;
    }
  };
  check("calories", "Calories");
  check("proteinGrams", "Protein");
  check("carbsGrams", "Carbs");
  check("fatGrams", "Fat");
  return errors;
}

export default function MealLogForm({
  date,
  slot,
  existingEntry,
  onSaved,
  onDeleted,
  onCancel,
}: Props) {
  const { toast } = useToast();
  const [fields, setFields] = useState<Fields>(() => toFields(existingEntry));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function set(key: keyof Fields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (key !== "notes") {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSave() {
    const errs = validateFields(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const entry = await saveMealLog({
        date,
        slotIndex: slot.index,
        calories: parseFloat(fields.calories),
        proteinGrams: parseFloat(fields.proteinGrams),
        carbsGrams: parseFloat(fields.carbsGrams),
        fatGrams: parseFloat(fields.fatGrams),
        notes: fields.notes.trim() || undefined,
      });
      onSaved(entry);
      toast("Meal logged.", "success");
    } catch {
      toast("Failed to save meal log.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingEntry) return;
    setDeleting(true);
    try {
      await deleteMealLog(existingEntry.id);
      onDeleted();
      toast("Meal log removed.", "success");
    } catch {
      toast("Failed to delete meal log.", "error");
    } finally {
      setDeleting(false);
    }
  }

  const t = slot.target;
  const busy = saving || deleting;

  return (
    <div className="space-y-5">
      {/* Slot header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{slot.name}</p>
          {slot.timeLabel && (
            <p className="text-xs text-slate-400">{slot.timeLabel}</p>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Target: {t.calories} kcal · P {t.proteinGrams}g · C {t.carbsGrams}g · F {t.fatGrams}g
        </p>
      </div>

      {/* Macro inputs */}
      <FormField label="Calories (kcal)" htmlFor="log-calories" error={errors.calories}>
        <Input
          id="log-calories"
          type="number"
          min={0}
          step={1}
          value={fields.calories}
          onChange={(e) => set("calories", e.target.value)}
          placeholder={String(t.calories)}
          hasError={!!errors.calories}
          disabled={busy}
        />
      </FormField>

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Protein (g)" htmlFor="log-protein" error={errors.proteinGrams}>
          <Input
            id="log-protein"
            type="number"
            min={0}
            step={1}
            value={fields.proteinGrams}
            onChange={(e) => set("proteinGrams", e.target.value)}
            placeholder={String(t.proteinGrams)}
            hasError={!!errors.proteinGrams}
            disabled={busy}
          />
        </FormField>

        <FormField label="Carbs (g)" htmlFor="log-carbs" error={errors.carbsGrams}>
          <Input
            id="log-carbs"
            type="number"
            min={0}
            step={1}
            value={fields.carbsGrams}
            onChange={(e) => set("carbsGrams", e.target.value)}
            placeholder={String(t.carbsGrams)}
            hasError={!!errors.carbsGrams}
            disabled={busy}
          />
        </FormField>

        <FormField label="Fat (g)" htmlFor="log-fat" error={errors.fatGrams}>
          <Input
            id="log-fat"
            type="number"
            min={0}
            step={1}
            value={fields.fatGrams}
            onChange={(e) => set("fatGrams", e.target.value)}
            placeholder={String(t.fatGrams)}
            hasError={!!errors.fatGrams}
            disabled={busy}
          />
        </FormField>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="log-notes"
          className="text-sm font-medium text-slate-300"
        >
          Notes (optional)
        </label>
        <textarea
          id="log-notes"
          rows={2}
          value={fields.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="What did you eat?"
          disabled={busy}
          className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleSave}
          disabled={busy}
        >
          {saving ? "Saving…" : existingEntry ? "Update log" : "Log meal"}
        </Button>

        {existingEntry && (
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={busy}
          >
            {deleting ? "Removing…" : "Remove"}
          </Button>
        )}

        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
