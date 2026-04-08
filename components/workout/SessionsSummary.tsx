import Card from "@/components/ui/Card";
import type { WorkoutDay } from "@/types/workout";
import { calculateExerciseVolume } from "@/lib/calculations/workouts";

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
        <p className="text-sm ">Exercises</p>
        <p className="text-2xl font-semibold ">{totalExercises}</p>
      </div>

      <div>
        <p className="text-sm ">Total Sets</p>
        <p className="text-2xl font-semibold ">{totalSets}</p>
      </div>

      <div>
        <p className="text-sm ">Completed Sets</p>
        <p className="text-2xl font-semibold ">{completedSets}</p>
      </div>

      <div>
        <p className="text-sm ">Total Volume</p>
        <p className="text-2xl font-semibold ">{totalVolume}</p>
      </div>
    </Card>
  );
}
