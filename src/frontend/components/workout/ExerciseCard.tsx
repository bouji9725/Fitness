"use client";

import { useState } from "react";
import type { PreviousBest, SessionExercise } from "@shared/types/workout";
import type { WorkoutSessionAction } from "@frontend/workout-session-reducer";
import Card from "@frontend/components/ui/Card";
import Button from "@frontend/components/ui/Button";
import {
  calculateExerciseVolume,
  isProgressiveOverload,
} from "@shared/calculations/workouts";
import PreviousPerformance from "./PreviousPerformance";
import OverloadBadge from "./OverloadBadge";
import SetRow from "./SetRow";
import RestTimer from "./RestTimer";

type ExerciseCardProps = {
  exercise: SessionExercise;
  dispatch: React.Dispatch<WorkoutSessionAction>;
  isActive?: boolean;
  previousBest?: PreviousBest;
};

export default function ExerciseCard({
  exercise,
  dispatch,
  isActive = false,
  previousBest,
}: ExerciseCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showTimer, setShowTimer] = useState(false);

  const firstCompletedSet = exercise.sets.find((set) => set.completed);
  // Prefer live history-based PR over the template's previousBest
  const previous = previousBest ?? exercise.previousBest;

  const improved =
    previous &&
    firstCompletedSet &&
    firstCompletedSet.weight !== undefined &&
    firstCompletedSet.reps !== undefined &&
    previous.weight !== undefined &&
    previous.reps !== undefined
      ? isProgressiveOverload(
          firstCompletedSet.weight,
          firstCompletedSet.reps,
          previous.weight,
          previous.reps
        )
      : false;

  const totalVolume = calculateExerciseVolume(exercise.sets);
  const completedSetCount = exercise.sets.filter((s) => s.completed).length;

  function handleToggleComplete() {
    dispatch({ type: "TOGGLE_EXERCISE_COMPLETED", exerciseId: exercise.id });
    // Auto-collapse when marking done; stay open when un-marking
    if (!exercise.isCompleted) {
      setIsOpen(false);
    }
  }

  // ── Collapsed view (exercise marked done) ────────────────────────────
  if (!isOpen) {
    return (
      <div className="flex items-center gap-4 rounded-[var(--radius-xl)] border border-emerald-400/20 bg-emerald-500/[0.07] px-5 py-4 transition">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/20">
          <svg
            aria-hidden="true"
            className="h-3.5 w-3.5 text-emerald-400"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              d="M2 7l3.5 3.5L12 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-200">{exercise.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {exercise.muscleGroup}&nbsp;&middot;&nbsp;
            {completedSetCount}/{exercise.sets.length} sets&nbsp;&middot;&nbsp;
            {totalVolume}
          </p>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            setIsOpen(true);
            if (exercise.isCompleted) {
              dispatch({ type: "TOGGLE_EXERCISE_COMPLETED", exerciseId: exercise.id });
            }
          }}
        >
          Edit
        </Button>
      </div>
    );
  }

  // ── Expanded view ────────────────────────────────────────────────────
  return (
    <Card
      className={[
        "space-y-5 transition",
        isActive && !exercise.isCompleted ? "ring-1 ring-inset ring-indigo-400/25" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Exercise
            </p>
            {isActive && !exercise.isCompleted && (
              <span className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-300">
                Up next
              </span>
            )}
          </div>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {exercise.name}
          </h3>

          <p className="mt-2 text-sm uppercase tracking-[0.14em] text-slate-400">
            {exercise.muscleGroup}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <OverloadBadge improved={improved} />

          <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={!!exercise.isCompleted}
              onChange={handleToggleComplete}
              aria-label="Mark exercise as completed"
              className="h-4 w-4 rounded border-slate-300"
            />
            Exercise completed
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <PreviousPerformance
          reps={previous?.reps}
          weight={previous?.weight}
        />
      </div>

      <div className="space-y-4">
        {exercise.sets.map((set) => (
          <SetRow
            key={set.id}
            exerciseId={exercise.id}
            set={set}
            dispatch={dispatch}
          />
        ))}
      </div>

      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}

      <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-300">
          Total volume:{" "}
          <span className="font-semibold text-white">{totalVolume}</span>
        </p>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setShowTimer((v) => !v)}>
            {showTimer ? "Hide timer" : "Rest timer"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => dispatch({ type: "ADD_SET", exerciseId: exercise.id })}
          >
            Add set
          </Button>
        </div>
      </div>
    </Card>
  );
}
