import Card from "@frontend/components/ui/Card";
import type { WorkoutSession } from "@shared/types/workout";
import { calculateExerciseVolume } from "@shared/calculations/workouts";

type SessionSummaryProps = {
  workout: WorkoutSession;
};

export default function SessionSummary({ workout }: SessionSummaryProps) {
  const totalExercises = workout.exercises.length;
  const completedExercises = workout.exercises.filter((e) => e.isCompleted).length;

  const totalSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.length,
    0
  );

  const completedSets = workout.exercises.reduce(
    (sum, exercise) => sum + exercise.sets.filter((s) => s.completed).length,
    0
  );

  const totalVolume = workout.exercises.reduce(
    (sum, exercise) => sum + calculateExerciseVolume(exercise.sets),
    0
  );

  const exerciseProgressPercent =
    totalExercises > 0
      ? Math.round((completedExercises / totalExercises) * 100)
      : 0;

  const stats = [
    {
      label: "Exercises done",
      value: `${completedExercises}`,
      suffix: `/ ${totalExercises}`,
    },
    { label: "Sets completed", value: `${completedSets}`, suffix: `/ ${totalSets}` },
    { label: "Total volume", value: String(totalVolume), suffix: undefined },
  ];

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Session progress
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {workout.templateName}
          </h3>
        </div>

        {/* Circular-ish percent */}
        <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-white">{exerciseProgressPercent}%</p>
          <p className="mt-0.5 text-xs text-slate-400">complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-indigo-500/70 transition-all duration-500"
          style={{ width: `${exerciseProgressPercent}%` }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <p className="text-xs text-slate-400">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {stat.value}
              {stat.suffix && (
                <span className="text-sm font-normal text-slate-400">
                  {" "}{stat.suffix}
                </span>
              )}
            </p>
          </article>
        ))}
      </div>
    </Card>
  );
}
