"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import type { SessionExercise, WorkoutSession as WorkoutSessionType, WorkoutTemplate } from "@/types/workout";
import ExerciseCard from "./ExerciseCard";
import AddExerciseForm from "./AddExerciseForm";
import SessionSummary from "./SessionsSummary";
import SaveWorkoutBar from "./SaveWorkoutBar";
import { workoutSessionReducer } from "@/lib/workout-session-reducer";
import {
  clearWorkoutSession,
  loadActiveWorkoutSessionForTemplate,
  saveWorkoutSession,
} from "@/lib/data/workouts";
import {
  createWorkoutSessionFromTemplate,
  resetWorkoutSessionFromTemplate,
} from "@/lib/services/workout-session-service";

type WorkoutSessionProps = {
  template: WorkoutTemplate;
};

export default function WorkoutSession({ template }: WorkoutSessionProps) {
  const [baseSession, setBaseSession] = useState<WorkoutSessionType | null>(null);
  const [sessionState, dispatch] = useReducer(
    workoutSessionReducer,
    baseSession ?? createWorkoutSessionFromTemplate(template)
  );
  const [hasHydrated, setHasHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadActiveWorkoutSessionForTemplate(template.id);

    if (saved) {
      setBaseSession(saved.session);
      dispatch({
        type: "RESET_WORKOUT",
        initialWorkout: saved.session,
      });
      setLastSavedAt(saved.savedAt);
    } else {
      const freshSession = createWorkoutSessionFromTemplate(template);
      setBaseSession(freshSession);
      dispatch({
        type: "RESET_WORKOUT",
        initialWorkout: freshSession,
      });
      setLastSavedAt(null);
    }

    setHasHydrated(true);
  }, [template]);

  const isDirty = useMemo(() => {
    if (!baseSession) return false;
    return JSON.stringify(sessionState) !== JSON.stringify(baseSession);
  }, [sessionState, baseSession]);

  function handleSaveWorkout() {
    saveWorkoutSession(sessionState);
    setBaseSession(sessionState);
    setLastSavedAt(new Date().toISOString());
  }

  function handleResetWorkout() {
    if (!sessionState) return;

    clearWorkoutSession(sessionState.id, template.id);

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
    return <div>Loading workout session...</div>;
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