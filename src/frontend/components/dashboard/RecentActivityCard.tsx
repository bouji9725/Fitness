import Link from "next/link";
import Card from "@frontend/components/ui/Card";
import EmptyState from "@frontend/components/ui/EmptyState";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { WorkoutSessionRecord } from "@shared/types/workout";

type Props = {
  latestBodyStats: BodyStatsEntry | null;
  recentWorkouts: WorkoutSessionRecord[];
};

export default function RecentActivityCard({
  latestBodyStats,
  recentWorkouts,
}: Props) {
  const hasData = latestBodyStats !== null || recentWorkouts.length > 0;

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Activity
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Recent entries
        </h3>
      </div>

      {!hasData ? (
        <EmptyState
          title="No activity yet"
          description="Add a progress entry or log a workout to see recent data here."
        />
      ) : (
        <div className="space-y-3">
          {latestBodyStats && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Progress
              </p>
              <p className="mt-2 text-base font-medium text-white">
                {latestBodyStats.weightKg} kg &middot;{" "}
                {latestBodyStats.bodyFatPercent}% body fat
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {latestBodyStats.date}
              </p>
            </div>
          )}

          {recentWorkouts.map((record) => {
            const key = `${record.savedAt}-${record.session.id}`;
            return (
              <div
                key={key}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Workout
                </p>
                <p className="mt-2 text-base font-medium text-white">
                  {record.session.templateName}
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {new Date(record.session.performedAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <Link
          href="/progress"
          className="text-sm text-indigo-400 underline-offset-2 hover:underline"
        >
          View all progress →
        </Link>
        <Link
          href="/workouts"
          className="text-sm text-indigo-400 underline-offset-2 hover:underline"
        >
          Log workout →
        </Link>
      </div>
    </Card>
  );
}
