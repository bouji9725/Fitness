"use client";

import { useEffect, useRef, useState } from "react";
import type { SessionExercise } from "@shared/types/workout";
import Button from "@frontend/components/ui/Button";
import Card from "@frontend/components/ui/Card";
import Input from "@frontend/components/ui/Input";
import FormField from "@frontend/components/ui/FormField";
import { createId } from "@shared/utils/create-id";

const BASE_MUSCLE_GROUPS = [
  "Back",
  "Biceps",
  "Calves",
  "Chest",
  "Core",
  "Forearms",
  "Glutes",
  "Hamstrings",
  "Legs",
  "Quads",
  "Shoulders",
  "Traps",
  "Triceps",
];

const CUSTOM_GROUPS_KEY = "fitsler-custom-muscle-groups";
const ADD_NEW_SENTINEL = "__add_new__";

function loadCustomGroups(): string[] {
  try {
    const raw = localStorage.getItem(CUSTOM_GROUPS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((g: unknown) => typeof g === "string") : [];
  } catch {
    return [];
  }
}

function persistCustomGroups(groups: string[]) {
  try {
    localStorage.setItem(CUSTOM_GROUPS_KEY, JSON.stringify(groups));
  } catch {
    // storage unavailable — silently continue
  }
}

type AddExerciseFormProps = {
  onAddExercise: (exercise: SessionExercise) => void;
};

export default function AddExerciseForm({ onAddExercise }: AddExerciseFormProps) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState("");
  const [customGroups, setCustomGroups] = useState<string[]>([]);
  const [newGroupDraft, setNewGroupDraft] = useState("");
  const newGroupInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCustomGroups(loadCustomGroups());
  }, []);

  const isAddingNew = selected === ADD_NEW_SENTINEL;

  const allGroups = [
    ...BASE_MUSCLE_GROUPS,
    ...customGroups.filter((g) => !BASE_MUSCLE_GROUPS.includes(g)),
  ].sort((a, b) => a.localeCompare(b));

  function confirmNewGroup() {
    const trimmed = newGroupDraft.trim();
    if (!trimmed) return;

    const already = allGroups.some(
      (g) => g.toLowerCase() === trimmed.toLowerCase()
    );

    if (!already) {
      const updated = [...customGroups, trimmed];
      setCustomGroups(updated);
      persistCustomGroups(updated);
    }

    setSelected(
      allGroups.find((g) => g.toLowerCase() === trimmed.toLowerCase()) ?? trimmed
    );
    setNewGroupDraft("");
  }

  function handleNewGroupKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmNewGroup();
    }
  }

  useEffect(() => {
    if (isAddingNew) {
      newGroupInputRef.current?.focus();
    }
  }, [isAddingNew]);

  const resolvedMuscleGroup = isAddingNew ? "" : selected;

  function handleAddExercise() {
    if (!name.trim() || !resolvedMuscleGroup) return;

    const newExercise: SessionExercise = {
      id: `session-exercise-${name.trim().toLowerCase().replace(/\s+/g, "-")}-${createId("id")}`,
      name: name.trim(),
      muscleGroup: resolvedMuscleGroup,
      previousBest: undefined,
      isCompleted: false,
      sets: [
        {
          id: createId("set"),
          reps: 0,
          weight: 0,
          completed: false,
        },
      ],
    };

    onAddExercise(newExercise);
    setName("");
    setSelected("");
  }

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Custom exercise
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Add exercise
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Add a new exercise and assign it to a muscle group for this session.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Exercise name" htmlFor="new-exercise-name">
          <Input
            id="new-exercise-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Incline Dumbbell Press"
          />
        </FormField>

        <FormField label="Muscle group" htmlFor="new-exercise-muscle-group">
          <select
            id="new-exercise-muscle-group"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="" disabled className="bg-slate-900">
              Select a muscle group
            </option>
            {allGroups.map((group) => (
              <option key={group} value={group} className="bg-slate-900">
                {group}
              </option>
            ))}
            <option
              value={ADD_NEW_SENTINEL}
              className="bg-slate-900 text-indigo-300"
            >
              + Add a new muscle group
            </option>
          </select>
        </FormField>
      </div>

      {isAddingNew && (
        <div className="flex gap-3">
          <Input
            ref={newGroupInputRef}
            value={newGroupDraft}
            onChange={(e) => setNewGroupDraft(e.target.value)}
            onKeyDown={handleNewGroupKeyDown}
            placeholder="e.g. Rear Delts"
            className="flex-1"
          />
          <Button
            variant="secondary"
            onClick={confirmNewGroup}
            disabled={!newGroupDraft.trim()}
          >
            Add group
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleAddExercise}
          disabled={!name.trim() || !resolvedMuscleGroup}
        >
          Add exercise
        </Button>
      </div>
    </Card>
  );
}
