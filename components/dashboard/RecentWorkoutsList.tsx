import Card from "@/components/ui/Card";
import type { WorkoutDay } from "@/types/workout";

type RecentWorkout = {
  workout: WorkoutDay;
  savedAt: string;
};

type RecentWorkoutsListProps = {
  items: RecentWorkout[];
};

export default function RecentWorkoutsList({
  items,
}: RecentWorkoutsListProps) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-slate-900">Recent Workouts</h3>
        <p className="text-sm text-slate-500">
          Your latest saved workout sessions
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No saved workouts yet. Save a session to see it here.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={`${item.workout.id}-${item.savedAt}`}
              className="rounded-xl border border-slate-200 p-3"
            >
              <p className="font-medium text-slate-900">{item.workout.name}</p>
              <p className="text-sm text-slate-500">{item.workout.date}</p>
              <p className="mt-1 text-xs text-slate-400">
                Saved: {new Date(item.savedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}