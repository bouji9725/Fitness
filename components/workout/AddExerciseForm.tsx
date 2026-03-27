"use client";

import { useState } from "react";
import type { Exercise } from "@/types/workout";
import type { WorkoutSessionAction } from "@/lib/workout-session-reducer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type AddExerciseFormProps = {
  dispatch: React.Dispatch<WorkoutSessionAction>;
};

export default function AddExerciseForm({ dispatch }: AddExerciseFormProps) {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

  function handleAddExercise() {
    if (!name.trim() || !muscleGroup.trim()) return;

    const newExercise: Exercise = {
      id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name,
      muscleGroup,
      sets: [
        {
          id: `set-${Date.now()}-1`,
          reps: 0,
          weight: 0,
          completed: false,
        },
      ],
    };

    dispatch({
      type: "ADD_EXERCISE",
      exercise: newExercise,
    });

    setName("");
    setMuscleGroup("");
  }

  return (
    <Card className="grid gap-4">
      <h3 className="text-xl font-semibold text-slate-900">Add Exercise</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Exercise name"
          className="min-h-11 rounded-xl border border-slate-200 px-3"
        />

        <input
          type="text"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          placeholder="Muscle group"
          className="min-h-11 rounded-xl border border-slate-200 px-3"
        />
      </div>

      <div>
        <Button type="button" onClick={handleAddExercise}>
          Add Exercise
        </Button>
      </div>
    </Card>
  );
}