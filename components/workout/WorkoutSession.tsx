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

type WorkoutSessionProps = {
  template: WorkoutTemplate;
};

export default function WorkoutSession({ template }: WorkoutSessionProps) {
  const [baseSession, setBaseSession] = useState<WorkoutSessionType | null>(null);
  const [sessionState, dispatch] = useReducer(
    workoutSessionReducer,
    null
  );
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

  async function handleSaveWorkout() {
    if (!sessionState) return;

    try {
      setError(null);

      const response = await fetch(`/api/workout-sessions/${sessionState.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionState),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.error || "Failed to save workout session."
        );
      }
      setBaseSession(sessionState);
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
  }

  function handleAddExercise(exercise: SessionExercise) {
    dispatch({
      type: "ADD_EXERCISE",
      exercise,
    });
  }

  if (!hasHydrated) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Loading workout session...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!sessionState) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        No workout session available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SessionSummary workout={sessionState} />

      <div className="space-y-4">
        {sessionState.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            dispatch={dispatch}
          />
        ))}
      </div>

      <AddExerciseForm onAddExercise={handleAddExercise} />

      <SaveWorkoutBar
        isDirty={isDirty}
        lastSavedAt={lastSavedAt}
        onSave={handleSaveWorkout}
        onReset={handleResetWorkout}
      />
    </div>
  );
}