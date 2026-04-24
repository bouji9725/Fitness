import type { SessionExercise } from "@/types/workout";
import type { WorkoutSessionAction } from "@/lib/workout-session-reducer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  calculateExerciseVolume,
  isProgressiveOverload,
} from "@/lib/calculations/workouts";
import PreviousPerformance from "./PreviousPerformance";
import OverloadBadge from "./OverloadBadge";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  exercise: SessionExercise;
  dispatch: React.Dispatch<WorkoutSessionAction>;
};

// Exercise card inside the workout session.
// This is the main editing surface for one exercise.
export default function ExerciseCard({
  exercise,
  dispatch,
}: ExerciseCardProps) {
  const firstCompletedSet = exercise.sets.find((set) => set.completed);
  const previous = exercise.previousBest;

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

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Exercise
          </p>

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
              onChange={() =>
                dispatch({
                  type: "TOGGLE_EXERCISE_COMPLETED",
                  exerciseId: exercise.id,
                })
              }
              aria-label="Mark exercise as completed"
              className="h-4 w-4 rounded border-slate-300"
            />
            Exercise completed
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <PreviousPerformance
          reps={exercise.previousBest?.reps}
          weight={exercise.previousBest?.weight}
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

      <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-300">
          Total volume:{" "}
          <span className="font-semibold text-white">{totalVolume}</span>
        </p>

        <Button
          variant="secondary"
          onClick={() =>
            dispatch({
              type: "ADD_SET",
              exerciseId: exercise.id,
            })
          }
        >
          Add set
        </Button>
      </div>
    </Card>
  );
}