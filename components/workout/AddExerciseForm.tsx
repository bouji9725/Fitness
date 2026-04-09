"use client";

import { useState } from "react";
import type { SessionExercise } from "@/types/workout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";

type AddExerciseFormProps = {
  onAddExercise: (exercise: SessionExercise) => void;
};

function createExerciseId(name: string) {
  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  return `session-exercise-${slug}-${crypto.randomUUID()}`;
}

function createSetId() {
  return `set-${crypto.randomUUID()}`;
}

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
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">Add Exercise</h3>
        <p className="text-sm text-slate-500">
          Add a new exercise and assign it to a muscle group.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Exercise name" htmlFor="exercise-name">
          <Input
            id="exercise-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Incline Dumbbell Press"
          />
        </FormField>

        <FormField label="Muscle group" htmlFor="muscle-group">
          <Input
            id="muscle-group"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            placeholder="e.g. Chest"
          />
        </FormField>
      </div>

      <Button type="button" onClick={handleAddExercise}>
        Add Exercise
      </Button>
    </Card>
  );
}