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
import { saveWorkoutSession } from "@/lib/data/workouts";

type WorkoutSessionProps = {
  template: WorkoutTemplate;
};

// Main workout workflow container.
// This component coordinates:
// - session creation
// - local editing state
// - save/reset actions
// - exercise rendering
//
// For the current frontend phase, saving is handled on the client through
// localStorage-backed helpers. We are not pretending this is a real backend yet.
export default function WorkoutSession({ template }: WorkoutSessionProps) {
  const [baseSession, setBaseSession] = useState<WorkoutSessionType | null>(null);
  const [sessionState, dispatch] = useReducer(workoutSessionReducer, null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function createSessionFromApi() {
      try {
        setHasHydrated(false);
        setError(null);

        const response = await fetch("/api/workout-sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ templateId: template.id }),
        });

        if (!response.ok) {
          throw new Error("Failed to create workout session.");
        }

        const session: WorkoutSessionType = await response.json();

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

    createSessionFromApi();
  }, [template]);

  const isDirty = useMemo(() => {
    if (!baseSession || !sessionState) return false;
    return JSON.stringify(sessionState) !== JSON.stringify(baseSession);
  }, [sessionState, baseSession]);

  function handleSaveWorkout() {
    if (!sessionState) return;

    try {
      setError(null);

      // Frontend-phase persistence:
      // save the current session to browser storage so the dashboard
      // and related pages can read the saved workout history.
      saveWorkoutSession(sessionState);

      // Snapshot the saved state so dirty-checking resets correctly.
      setBaseSession(structuredClone(sessionState));
      setLastSavedAt(new Date().toISOString());
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