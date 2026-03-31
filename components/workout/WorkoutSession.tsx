"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import type { WorkoutDay } from "@/types/workout";
import ExerciseCard from "./ExerciseCard";
import AddExerciseForm from "./AddExerciseForm";
import SessionSummary from "./SessionsSummary";
import SaveWorkoutBar from "./SaveWorkoutBar";
import { workoutSessionReducer } from "@/lib/workout-session-reducer";
import {
  clearWorkoutSession,
  loadWorkoutSession,
  saveWorkoutSession,
} from "@/lib/data/workouts";

type WorkoutSessionProps = {
  workout: WorkoutDay;
};

export default function WorkoutSession({ workout }: WorkoutSessionProps) {
  const [sessionState, dispatch] = useReducer(workoutSessionReducer, workout);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadWorkoutSession(workout.id);

    if (saved) {
      dispatch({
        type: "RESET_WORKOUT",
        initialWorkout: saved.workout,
      });
      setLastSavedAt(saved.savedAt);
    }

    setHasHydrated(true);
  }, [workout.id]);

  const isDirty = useMemo(() => {
    return JSON.stringify(sessionState) !== JSON.stringify(workout);
  }, [sessionState, workout]);

  function handleSaveWorkout() {
    saveWorkoutSession(sessionState);
    setLastSavedAt(new Date().toISOString());
  }

  function handleResetWorkout() {
    clearWorkoutSession(workout.id);
    dispatch({
      type: "RESET_WORKOUT",
      initialWorkout: workout,
    });
    setLastSavedAt(null);
  }

  if (!hasHydrated) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">Loading workout session...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <SaveWorkoutBar
        onSave={handleSaveWorkout}
        onReset={handleResetWorkout}
        isDirty={isDirty}
        lastSavedAt={lastSavedAt}
      />

      <SessionSummary workout={sessionState} />

      <AddExerciseForm dispatch={dispatch} />

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