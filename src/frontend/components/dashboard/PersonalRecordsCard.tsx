import Card from "@frontend/components/ui/Card";
import type { WorkoutSessionRecord } from "@shared/types/workout";

type PR = {
  exerciseName: string;
  weightKg: number;
  reps: number;
};

function computePRs(sessions: WorkoutSessionRecord[]): PR[] {
  const best = new Map<string, PR>();

  for (const record of sessions) {
    for (const exercise of record.session.exercises) {
      for (const set of exercise.sets) {
        if (!set.completed || set.weight == null || set.reps == null) continue;
        const key = exercise.name.toLowerCase();
        const existing = best.get(key);
        if (!existing || set.weight > existing.weightKg) {
          best.set(key, {
            exerciseName: exercise.name,
            weightKg: set.weight,
            reps: set.reps,
          });
        }
      }
    }
  }

  return [...best.values()].sort((a, b) =>
    a.exerciseName.localeCompare(b.exerciseName)
  );
}

type Props = {
  sessions: WorkoutSessionRecord[];
};

export default function PersonalRecordsCard({ sessions }: Props) {
  const prs = computePRs(sessions);

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Personal records
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Best lifts
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Heaviest completed set per exercise across all saved sessions.
        </p>
      </div>

      {prs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          Complete and save a workout to see your personal records here.
        </div>
      ) : (
        <div className="space-y-2">
          {prs.map((pr) => (
            <div
              key={pr.exerciseName}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="text-sm font-medium text-white">
                {pr.exerciseName}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">{pr.weightKg} kg</span>
                <span className="ml-1 text-slate-400">× {pr.reps}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
