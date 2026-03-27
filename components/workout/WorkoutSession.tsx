"use client";

import { useReducer } from "react";
import type { WorkoutDay } from "@/types/workout";
import Button from "@/components/ui/Button";
import ExerciseCard from "./ExerciseCard";
import { workoutSessionReducer } from "@/lib/workout-session-reducer";

type WorkoutSessionProps = {
  workout: WorkoutDay;
};

export default function WorkoutSession({ workout }: WorkoutSessionProps) {
  const [sessionState, dispatch] = useReducer(workoutSessionReducer, workout);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Track your workout
          </h2>
          <p className="text-sm text-slate-500">
            Update reps, weight, and completed sets in real time.
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() =>
            dispatch({
              type: "RESET_WORKOUT",
              initialWorkout: workout,
            })
          }
        >
          Reset Workout
        </Button>
      </div>

      {sessionState.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          dispatch={dispatch}
        />
      ))}
    </div>
  );
}