import Card from "@/components/ui/Card";
import type { WorkoutSession } from "@/types/workout";
import { calculateExerciseVolume } from "@/lib/calculations/workouts";

type SessionSummaryProps = {
  workout: WorkoutSession;
};

export default function SessionSummary({ workout }: SessionSummaryProps) {
  const totalExercises = workout.exercises.length;

  const totalSets = workout.exercises.reduce((sum, exercise) => {
    return sum + exercise.sets.length;
  }, 0);

  const completedSets = workout.exercises.reduce((sum, exercise) => {
    return sum + exercise.sets.filter((set) => set.completed).length;
  }, 0);

  const totalVolume = workout.exercises.reduce((sum, exercise) => {
    return sum + calculateExerciseVolume(exercise.sets);
  }, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="space-y-1">
        <p className="text-sm text-slate-500">Exercises</p>
        <p className="text-2xl font-semibold text-slate-900">{totalExercises}</p>
      </Card>

      <Card className="space-y-1">
        <p className="text-sm text-slate-500">Total Sets</p>
        <p className="text-2xl font-semibold text-slate-900">{totalSets}</p>
      </Card>

      <Card className="space-y-1">
        <p className="text-sm text-slate-500">Completed Sets</p>
        <p className="text-2xl font-semibold text-slate-900">{completedSets}</p>
      </Card>

      <Card className="space-y-1">
        <p className="text-sm text-slate-500">Total Volume</p>
        <p className="text-2xl font-semibold text-slate-900">{totalVolume}</p>
      </Card>
    </div>
  );
}