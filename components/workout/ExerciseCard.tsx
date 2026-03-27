import Card from "../ui/Card";
import type { Exercise } from "@/types/workout";
import { calculateExerciseVolume, isProgressiveOverload } from "@/lib/calculations";
import PreviousPerformance from "./PreviousPerformance";
import OverloadBadge from "./OverloadBadge";
import SetRow from "./SetRow";

type ExerciseCardProps = {
  exercise: Exercise;
};

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const firstSet = exercise.sets[0];
  const previous = exercise.previousBest;

  const improved =
    previous && firstSet
      ? isProgressiveOverload(
          firstSet.weight,
          firstSet.reps,
          previous.weight,
          previous.reps
        )
      : false;

  const totalVolume = calculateExerciseVolume(exercise.sets);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">{exercise.name}</h3>
          <p className="text-sm text-slate-500">{exercise.muscleGroup}</p>
        </div>

        <OverloadBadge improved={improved} />
      </div>

      <PreviousPerformance
        reps={exercise.previousBest?.reps}
        weight={exercise.previousBest?.weight}
      />

      <div className="space-y-3">
        {exercise.sets.map((set) => (
          <SetRow key={set.id} set={set} />
        ))}
      </div>

      <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Total volume: <span className="font-semibold">{totalVolume}</span>
      </div>
    </Card>
  );
}