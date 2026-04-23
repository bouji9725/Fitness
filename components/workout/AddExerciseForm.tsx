"use client";

import { useState } from "react";
import type { SessionExercise } from "@/types/workout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";
import { createId } from "@/lib/utils/create-id";

type AddExerciseFormProps = {
  onAddExercise: (exercise: SessionExercise) => void;
};

function createExerciseId(name: string) {
  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  return `session-exercise-${slug}-${createId("id")}`;
}

function createSetId() {
  return createId("set");
}

// Lightweight form for adding a custom exercise to the current session.
export default function AddExerciseForm({
  onAddExercise,
}: AddExerciseFormProps) {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

  function handleAddExercise() {
    if (!name.trim() || !muscleGroup.trim()) return;

    const newExercise: SessionExercise = {
      id: createExerciseId(name),
      name: name.trim(),
      muscleGroup: muscleGroup.trim(),
      previousBest: undefined,
      isCompleted: false,
      sets: [
        {
          id: createSetId(),
          reps: 0,
          weight: 0,
          completed: false,
        },
      ],
    };

    onAddExercise(newExercise);
    setName("");
    setMuscleGroup("");
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
          <Input
            id="new-exercise-muscle-group"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            placeholder="e.g. Chest"
          />
        </FormField>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleAddExercise}>Add exercise</Button>
      </div>
    </Card>
  );
}