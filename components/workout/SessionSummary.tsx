import Card from "@/components/ui/Card";
import type { WorkoutSession } from "@/types/workout";
import { calculateExerciseVolume } from "@/lib/calculations/workouts";

type SessionSummaryProps = {
  workout: WorkoutSession;
};

// Compact summary block for the active workout session.
// This helps the user understand progress without leaving the page.
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

  const stats = [
    { label: "Exercises", value: totalExercises },
    { label: "Total sets", value: totalSets },
    { label: "Completed sets", value: completedSets },
    { label: "Total volume", value: totalVolume },
  ];

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Session summary
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Current workout overview
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Track how much work has been completed in the current session.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {stat.value}
            </p>
          </article>
        ))}
      </div>
    </Card>
  );
}