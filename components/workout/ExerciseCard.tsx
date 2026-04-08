import type { Exercise } from "@/types/workout";
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
  exercise: Exercise;
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
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold ">
            {exercise.name}
          </h3>
          <p className="text-sm ">{exercise.muscleGroup}</p>
        </div>

        <OverloadBadge improved={improved} />
      </div>

      <PreviousPerformance
        reps={exercise.previousBest?.reps}
        weight={exercise.previousBest?.weight}
      />

      <div className="space-y-3">
        {exercise.sets.map((set) => (
          <SetRow
            key={set.id}
            exerciseId={exercise.id}
            set={set}
            dispatch={dispatch}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">
        <input
          id={`${exercise.id}-completed`}
          type="checkbox"
          checked={exercise.isCompleted ?? false}
          onChange={() =>
            dispatch({
              type: "TOGGLE_EXERCISE_COMPLETED",
              exerciseId: exercise.id,
            })
          }
          aria-label="Mark exercise as completed"
          className="h-5 w-5 rounded border-slate-300"
        />
        <label htmlFor={`${exercise.id}-completed`} className="font-medium">
          Exercise Completed
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-xl bg-slate-500 px-4 py-3 text-sm ">
          Total volume: <span className="font-semibold">{totalVolume}</span>
        </div>

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
