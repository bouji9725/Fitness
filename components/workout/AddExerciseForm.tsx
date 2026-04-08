"use client";

import { useState } from "react";
import type { SessionExercise } from "@/types/workout";
import type { WorkoutSessionAction } from "@/lib/workout-session-reducer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import FormField from "@/components/ui/FormField";

type AddExerciseFormProps = {
  dispatch: React.Dispatch<WorkoutSessionAction>;
};

export default function AddExerciseForm({
  dispatch,
}: AddExerciseFormProps) {
  const [name, setName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");

  function handleAddExercise() {
    if (!name.trim() || !muscleGroup.trim()) return;

    const newExercise: SessionExercise = {
      id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: name.trim(),
      muscleGroup: muscleGroup.trim(),
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
    <div className="min-w-0">
      <Card className="grid gap-4 min-w-0">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold">Add Exercise</h3>
          <p className="mt-1 text-sm">
            Add a new exercise and assign it to a muscle group.
          </p>
        </div>

        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <div className="min-w-0">
            <FormField label="Exercise Name" htmlFor="exercise-name">
              <Input
                id="exercise-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Incline Dumbbell Press"
              />
            </FormField>
          </div>

          <div className="min-w-0">
            <FormField label="Muscle Group" htmlFor="muscle-group">
              <Input
                id="muscle-group"
                type="text"
                value={muscleGroup}
                onChange={(e) => setMuscleGroup(e.target.value)}
                placeholder="e.g. Chest"
              />
            </FormField>
          </div>
        </div>

        <div className="min-w-0">
          <Button type="button" variant="secondary" onClick={handleAddExercise}>
            Add Exercise
          </Button>
        </div>
      </Card>
    </div>
  );
}