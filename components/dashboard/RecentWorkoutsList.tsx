import Card from "@/components/ui/Card";
import type { WorkoutSessionRecord } from "@/types/workout";

type RecentWorkoutsListProps = {
  items: WorkoutSessionRecord[];
};

export default function RecentWorkoutsList({
  items,
}: RecentWorkoutsListProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">
          Recent Workouts
        </h3>
        <p className="text-sm text-slate-500">
          Your latest saved workout sessions
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No saved workouts yet. Save a session to see it here.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.session.id}
              className="rounded-xl border border-slate-200 p-3"
            >
              <p className="font-medium text-slate-900">
                {item.session.templateName}
              </p>
              <p className="text-sm text-slate-500">
                Performed: {new Date(item.session.performedAt).toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">
                Saved: {new Date(item.savedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}