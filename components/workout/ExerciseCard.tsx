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

export default function ExerciseCard({
  exercise,
  dispatch,
}: ExerciseCardProps) {
  const firstCompletedSet = exercise.sets.find((set) => set.completed);
  const previous = exercise.previousBest;

  const improved =
    previous && firstCompletedSet
      ? isProgressiveOverload(
          firstCompletedSet.weight,
          firstCompletedSet.reps,
          previous.weight,
          previous.reps
        )
      : false;

  const totalVolume = calculateExerciseVolume(exercise.sets);

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">
              {exercise.name}
            </h3>
            <OverloadBadge improved={improved} />
          </div>

          <p className="text-sm text-slate-500">{exercise.muscleGroup}</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={Boolean(exercise.isCompleted)}
            onChange={() =>
              dispatch({
                type: "TOGGLE_EXERCISE_COMPLETED",
                exerciseId: exercise.id,
              })
            }
            aria-label="Mark exercise as completed"
            className="h-5 w-5 rounded border-slate-300"
          />
          Exercise Completed
        </label>
      </div>

      <PreviousPerformance
        reps={previous?.reps}
        weight={previous?.weight}
      />

      <div className="space-y-3">
        {exercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            exerciseId={exercise.id}
            dispatch={dispatch}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">Total volume: {totalVolume}</p>

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            dispatch({
              type: "ADD_SET",
              exerciseId: exercise.id,
            })
          }
        >
          Add Set
        </Button>
      </div>
    </Card>
  );
}