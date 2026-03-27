import Card from "@/components/ui/Card";
import type { WorkoutDay } from "@/types/workout";
import { calculateExerciseVolume } from "@/lib/calculations";

type SessionSummaryProps = {
  workout: WorkoutDay;
};

export default function SessionSummary({ workout }: SessionSummaryProps) {
  const totalExercises = workout.exercises.length;

  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length,
    0
  );

  const completedSets = workout.exercises.reduce(
    (sum, exercise) =>
      sum + exercise.sets.filter((set) => set.completed).length,
    0
  );

  const totalVolume = workout.exercises.reduce(
    (sum, exercise) => sum + calculateExerciseVolume(exercise.sets),
    0
  );

  return (
    <Card className="grid gap-3 md:grid-cols-4">
      <div>
        <p className="text-sm text-slate-500">Exercises</p>
        <p className="text-2xl font-semibold text-slate-900">{totalExercises}</p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Total Sets</p>
        <p className="text-2xl font-semibold text-slate-900">{totalSets}</p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Completed Sets</p>
        <p className="text-2xl font-semibold text-slate-900">{completedSets}</p>
      </div>

      <div>
        <p className="text-sm text-slate-500">Total Volume</p>
        <p className="text-2xl font-semibold text-slate-900">{totalVolume}</p>
      </div>
    </Card>
  );
}