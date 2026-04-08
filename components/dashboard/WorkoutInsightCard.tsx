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
        <h3 className="text-xl font-semibold ">Recent Workouts</h3>
        <p className="text-sm ">
          Your latest saved workout sessions
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm ">
          No saved workouts yet. Save a session to see it here.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={`${item.workout.id}-${item.savedAt}`}
              className="rounded-xl border border-slate-200 p-3"
            >
              <p className="font-medium ">{item.workout.name}</p>
              <p className="text-sm ">{item.workout.date}</p>
              <p className="mt-1 text-xs ">
                Saved: {new Date(item.savedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
