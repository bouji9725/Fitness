import Card from "@/components/ui/Card";
import type { WorkoutSessionRecord } from "@/types/workout";

type RecentWorkoutsListProps = {
  items: WorkoutSessionRecord[];
};

// Recent saved workout sessions.
// Keep this focused on readable history, not deep analytics.
export default function RecentWorkoutsList({
  items,
}: RecentWorkoutsListProps) {
  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Activity
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Recent workouts
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Your latest saved workout sessions.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          No saved workouts yet. Save a session to see it here.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const itemKey = `${item.savedAt}-${item.session.performedAt}-${item.session.templateName}`;

            return (
              <article
                key={itemKey}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-base font-medium text-white">
                  {item.session.templateName}
                </p>

                <div className="mt-2 space-y-1 text-sm text-slate-300">
                  <p>
                    Performed:{" "}
                    {new Date(item.session.performedAt).toLocaleString()}
                  </p>
                  <p>Saved: {new Date(item.savedAt).toLocaleString()}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Card>
  );
}