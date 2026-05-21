"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import type {
  PreviousBest,
  SessionExercise,
  WorkoutSession as WorkoutSessionType,
  WorkoutSessionRecord,
  WorkoutTemplate,
} from "@shared/types/workout";
import ExerciseCard from "./ExerciseCard";
import AddExerciseForm from "./AddExerciseForm";
import SessionSummary from "./SessionSummary";
import SaveWorkoutBar from "./SaveWorkoutBar";
import { workoutSessionReducer } from "@frontend/workout-session-reducer";
import { resetWorkoutSessionFromTemplate } from "@shared/services/workout-session-service";
import {
  createWorkoutSession,
  listSavedWorkoutSessions,
  updateWorkoutSession,
} from "@frontend/api/workouts-api";
import { useToast } from "@frontend/context/ToastContext";

type WorkoutSessionProps = {
  template: WorkoutTemplate;
  initialSession?: WorkoutSessionType;
};

export default function WorkoutSession({ template, initialSession }: WorkoutSessionProps) {
  const [baseSession, setBaseSession] = useState<WorkoutSessionType | null>(null);
  const [sessionState, dispatch] = useReducer(workoutSessionReducer, null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [initError, setInitError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [historySessions, setHistorySessions] = useState<WorkoutSessionRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function createSession() {
      try {
        setHasHydrated(false);
        setInitError(null);

        const history = await listSavedWorkoutSessions({ limit: 100 });
        setHistorySessions(history.data);

        const session = initialSession ?? await createWorkoutSession(template.id);

        setBaseSession(session);
        dispatch({ type: "RESET_WORKOUT", initialWorkout: session });
        setLastSavedAt(null);
      } catch (err) {
        setInitError(
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

  const isAllComplete = useMemo(
    () =>
      !!sessionState &&
      sessionState.exercises.length > 0 &&
      sessionState.exercises.every((e) => e.isCompleted),
    [sessionState]
  );

  const actualPRs = useMemo((): Map<string, PreviousBest> => {
    const best = new Map<string, PreviousBest>();
    for (const record of historySessions) {
      for (const exercise of record.session.exercises) {
        const key = exercise.name.toLowerCase();
        for (const set of exercise.sets) {
          if (!set.completed || set.weight == null || set.reps == null) continue;
          const existing = best.get(key);
          if (!existing || set.weight > existing.weight) {
            best.set(key, { weight: set.weight, reps: set.reps });
          }
        }
      }
    }
    return best;
  }, [historySessions]);

  async function handleSaveWorkout() {
    if (!sessionState) return;

    try {
      const savedRecord = await updateWorkoutSession({
        ...sessionState,
        status: isAllComplete ? "completed" : "draft",
        notes: notes.trim() || undefined,
      });

      setBaseSession(savedRecord.session);
      setLastSavedAt(savedRecord.savedAt);

      dispatch({ type: "RESET_WORKOUT", initialWorkout: savedRecord.session });
      toast("Workout saved!", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not save workout — try again",
        "error"
      );
    }
  }

  function handleResetWorkout() {
    if (!sessionState) return;

    const resetSession = resetWorkoutSessionFromTemplate(sessionState, template);

    setBaseSession(resetSession);
    dispatch({ type: "RESET_WORKOUT", initialWorkout: resetSession });
    setLastSavedAt(null);
  }

  function handleAddExercise(exercise: SessionExercise) {
    dispatch({ type: "ADD_EXERCISE", exercise });
  }

  if (!hasHydrated) {
    return (
      <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
        Loading workout session...
      </section>
    );
  }

  if (initError) {
    return (
      <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6">
        <p className="text-sm font-medium text-red-100">{initError}</p>
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
        isAllComplete={isAllComplete}
        lastSavedAt={lastSavedAt}
      />

      <SessionSummary workout={sessionState} />

      <section className="space-y-4">
        {sessionState.exercises.map((exercise, index) => {
          const firstIncompleteIndex = sessionState.exercises.findIndex(
            (e) => !e.isCompleted
          );
          return (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              dispatch={dispatch}
              isActive={index === firstIncompleteIndex}
              previousBest={actualPRs.get(exercise.name.toLowerCase())}
            />
          );
        })}
      </section>

      <AddExerciseForm onAddExercise={handleAddExercise} />

      <div className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
        <label
          htmlFor="session-notes"
          className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300"
        >
          Session notes
        </label>
        <p className="mt-2 text-sm text-slate-400">
          Energy level, sleep, injuries, or anything worth remembering about this session.
        </p>
        <textarea
          id="session-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Optional — e.g. felt strong today, left shoulder tight"
          className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>
    </div>
  );
}
