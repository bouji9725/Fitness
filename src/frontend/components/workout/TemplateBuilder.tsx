"use client";

import { useEffect, useState } from "react";
import Button from "@frontend/components/ui/Button";
import { useToast } from "@frontend/context/ToastContext";
import {
  searchExercises,
  createUserWorkoutTemplate,
  updateUserWorkoutTemplate,
  deleteUserWorkoutTemplate,
  listUserWorkoutTemplates,
} from "@frontend/api/workouts-api";
import type { ExerciseCatalogEntry, ExerciseTemplate, WorkoutTemplate } from "@shared/types/workout";

const MUSCLE_GROUPS = [
  "Back", "Biceps", "Calves", "Chest", "Core",
  "Forearms", "Full Body", "Glutes", "Hamstrings",
  "Quads", "Shoulders", "Traps", "Triceps",
];

function makeDefaultSets(count: number): ExerciseTemplate["defaultSets"] {
  return Array.from({ length: count }, (_, i) => ({
    id: `set-${i + 1}`,
    reps: undefined,
    weight: undefined,
    completed: false,
  }));
}

function catalogToExercise(entry: ExerciseCatalogEntry, sets: number): ExerciseTemplate {
  return {
    id: entry.id,
    name: entry.name,
    muscleGroup: entry.muscleGroup,
    defaultSets: makeDefaultSets(sets),
  };
}

type BuilderExercise = ExerciseTemplate & { setCount: number };

type Props = {
  onTemplatesChange: (templates: WorkoutTemplate[]) => void;
};

export default function TemplateBuilder({ onTemplatesChange }: Props) {
  const { toast } = useToast();

  // List state
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Builder state
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [exercises, setExercises] = useState<BuilderExercise[]>([]);
  const [saving, setSaving] = useState(false);

  // Exercise picker state
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerMuscle, setPickerMuscle] = useState("");
  const [pickerResults, setPickerResults] = useState<ExerciseCatalogEntry[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (!showBuilder) return;
    setPickerLoading(true);
    searchExercises({ search: pickerSearch, muscleGroup: pickerMuscle })
      .then(setPickerResults)
      .catch(() => {})
      .finally(() => setPickerLoading(false));
  }, [pickerSearch, pickerMuscle, showBuilder]);

  async function loadTemplates() {
    setLoadingTemplates(true);
    try {
      const data = await listUserWorkoutTemplates();
      setTemplates(data);
      onTemplatesChange(data);
    } catch {
      toast("Failed to load your templates.", "error");
    } finally {
      setLoadingTemplates(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setTemplateName("");
    setExercises([]);
    setPickerSearch("");
    setPickerMuscle("");
    setShowBuilder(true);
  }

  function openEdit(template: WorkoutTemplate) {
    setEditingId(template.id);
    setTemplateName(template.name);
    setExercises(
      template.exercises.map((ex) => ({ ...ex, setCount: ex.defaultSets.length || 3 }))
    );
    setPickerSearch("");
    setPickerMuscle("");
    setShowBuilder(true);
  }

  function closeBuilder() {
    setShowBuilder(false);
    setEditingId(null);
  }

  function addExercise(entry: ExerciseCatalogEntry) {
    if (exercises.some((ex) => ex.id === entry.id)) return;
    const ex = catalogToExercise(entry, 3);
    setExercises((prev) => [...prev, { ...ex, setCount: 3 }]);
  }

  function removeExercise(id: string) {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  }

  function updateSetCount(id: string, count: number) {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, setCount: count, defaultSets: makeDefaultSets(count) }
          : ex
      )
    );
  }

  async function handleSave() {
    if (!templateName.trim()) {
      toast("Template name is required.", "error");
      return;
    }
    if (exercises.length === 0) {
      toast("Add at least one exercise.", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = exercises.map(({ setCount: _, ...ex }) => ex);
      let saved: WorkoutTemplate;
      if (editingId) {
        saved = await updateUserWorkoutTemplate(editingId, templateName.trim(), payload);
        setTemplates((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
        toast("Template updated.", "success");
      } else {
        saved = await createUserWorkoutTemplate(templateName.trim(), payload);
        setTemplates((prev) => [saved, ...prev]);
        toast("Template created.", "success");
      }
      onTemplatesChange(
        editingId
          ? templates.map((t) => (t.id === saved.id ? saved : t))
          : [saved, ...templates]
      );
      closeBuilder();
    } catch {
      toast("Failed to save template.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteUserWorkoutTemplate(id);
      const next = templates.filter((t) => t.id !== id);
      setTemplates(next);
      onTemplatesChange(next);
      if (editingId === id) closeBuilder();
      toast("Template deleted.", "success");
    } catch {
      toast("Failed to delete template.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const addedIds = new Set(exercises.map((ex) => ex.id));

  return (
    <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Custom templates
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            My templates
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Build your own workout templates with exercises from the library.
          </p>
        </div>
        {!showBuilder && (
          <Button variant="primary" onClick={openCreate} className="shrink-0">
            + Create template
          </Button>
        )}
      </div>

      {/* Existing templates list */}
      {!showBuilder && (
        <>
          {loadingTemplates ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : templates.length === 0 ? (
            <p className="text-sm text-slate-400">
              No custom templates yet. Click &ldquo;Create template&rdquo; to build your first one.
            </p>
          ) : (
            <div className="space-y-3">
              {templates.map((t) => {
                const muscleGroups = [...new Set(t.exercises.map((ex) => ex.muscleGroup))];
                return (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {t.exercises.length} exercise{t.exercises.length !== 1 ? "s" : ""}
                        {muscleGroups.length > 0 && (
                          <span className="ml-2 text-slate-500">· {muscleGroups.join(" · ")}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="text-xs text-indigo-300 hover:text-indigo-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                        className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
                      >
                        {deletingId === t.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Builder form */}
      {showBuilder && (
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">
              Template name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. Push Day, Upper Body Strength…"
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Exercises added */}
          {exercises.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Exercises in template
              </p>
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{ex.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{ex.muscleGroup}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-xs text-slate-400 whitespace-nowrap">Sets</label>
                    <select
                      value={ex.setCount}
                      onChange={(e) => updateSetCount(ex.id, Number(e.target.value))}
                      className="rounded-xl border border-white/10 bg-slate-900/60 px-2 py-1 text-sm text-white focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeExercise(ex.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Exercise picker */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Add exercises
            </p>
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                placeholder="Search…"
                className="min-h-9 flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <select
                value={pickerMuscle}
                onChange={(e) => setPickerMuscle(e.target.value)}
                className="min-h-9 rounded-2xl border border-white/10 bg-slate-900/60 px-3 py-1 text-sm text-white focus:outline-none"
              >
                <option value="">All groups</option>
                {MUSCLE_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {pickerLoading ? (
                <p className="text-xs text-slate-500">Loading…</p>
              ) : pickerResults.length === 0 ? (
                <p className="text-xs text-slate-400">No exercises found.</p>
              ) : (
                pickerResults.map((entry) => {
                  const added = addedIds.has(entry.id);
                  return (
                    <button
                      key={entry.id}
                      onClick={() => addExercise(entry)}
                      disabled={added}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                        added
                          ? "border-indigo-400/20 bg-indigo-500/10 text-slate-400 cursor-default"
                          : "border-white/10 bg-white/5 text-white hover:border-indigo-400/30 hover:bg-white/8"
                      }`}
                    >
                      <span>
                        <span className="font-medium">{entry.name}</span>
                        <span className="ml-2 text-xs text-slate-400">{entry.muscleGroup}</span>
                      </span>
                      <span className="text-xs text-indigo-300">
                        {added ? "Added" : "+ Add"}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editingId ? "Update template" : "Save template"}
            </Button>
            <Button variant="ghost" onClick={closeBuilder}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
