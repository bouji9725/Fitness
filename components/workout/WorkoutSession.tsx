"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import type {
  SessionExercise,
  WorkoutSession as WorkoutSessionType,
  WorkoutTemplate,
} from "@/types/workout";
import ExerciseCard from "./ExerciseCard";
import AddExerciseForm from "./AddExerciseForm";
import SessionSummary from "./SessionSummary";
import SaveWorkoutBar from "./SaveWorkoutBar";
import { workoutSessionReducer } from "@/lib/workout-session-reducer";
import { resetWorkoutSessionFromTemplate } from "@/lib/services/workout-session-service";
import {
  createWorkoutSession,
  updateWorkoutSession,
} from "@/lib/api/workouts-api";

type WorkoutSessionProps = {
  template: WorkoutTemplate;
};

// Main workout workflow container.
// UI talks to the API client. It does not know how persistence is implemented.
export default function WorkoutSession({ template }: WorkoutSessionProps) {
  const [baseSession, setBaseSession] = useState<WorkoutSessionType | null>(
    null
  );
  const [sessionState, dispatch] = useReducer(workoutSessionReducer, null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createSession() {
      try {
        setHasHydrated(false);
        setError(null);

        const session = await createWorkoutSession(template.id);

        setBaseSession(session);
        dispatch({
          type: "RESET_WORKOUT",
          initialWorkout: session,
        });
        setLastSavedAt(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while creating the workout session."
        );
      } finally {
        setHasHydrated(true);
      }
    }

    createSession();
  }, [template.id]);

  const isDirty = useMemo(() => {
    if (!baseSession || !sessionState) return false;
    return JSON.stringify(sessionState) !== JSON.stringify(baseSession);
  }, [sessionState, baseSession]);

  async function handleSaveWorkout() {
    if (!sessionState) return;

    try {
      setError(null);

      const savedRecord = await updateWorkoutSession(sessionState);

      setBaseSession(savedRecord.session);
      setLastSavedAt(savedRecord.savedAt);

      dispatch({
        type: "RESET_WORKOUT",
        initialWorkout: savedRecord.session,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the workout session."
      );
    }
  }

  function handleResetWorkout() {
    if (!sessionState) return;

    const resetSession = resetWorkoutSessionFromTemplate(sessionState, template);

    setBaseSession(resetSession);
    dispatch({
      type: "RESET_WORKOUT",
      initialWorkout: resetSession,
    });
    setLastSavedAt(null);
    setError(null);
  }

  function handleAddExercise(exercise: SessionExercise) {
    dispatch({
      type: "ADD_EXERCISE",
      exercise,
    });
  }

  if (!hasHydrated) {
    return (
      <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
        Loading workout session...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6">
        <p className="text-sm font-medium text-red-100">{error}</p>
      </section>
    );
  }

  if (!sessionState) {
    return (
      <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
        No workout session available.
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <SaveWorkoutBar
        onSave={handleSaveWorkout}
        onReset={handleResetWorkout}
        isDirty={isDirty}
        lastSavedAt={lastSavedAt}
      />

      <SessionSummary workout={sessionState} />

      <section className="space-y-6">
        {sessionState.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            dispatch={dispatch}
          />
        ))}
      </section>

      <AddExerciseForm onAddExercise={handleAddExercise} />
    </div>
  );
}