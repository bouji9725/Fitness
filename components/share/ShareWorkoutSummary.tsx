import Card from "@/components/ui/Card";
import type { StoredWorkoutSession } from "@/types/share";

type ShareWorkoutSummaryProps = {
  workouts: StoredWorkoutSession[];
};

export default function ShareWorkoutSummary({
  workouts,
}: ShareWorkoutSummaryProps) {
  return (
    <Card className="grid gap-4">
      <div>
        <h3 className="text-xl font-semibold ">Workout Summary</h3>
        <p className="text-sm ">
          Latest saved workout sessions
        </p>
      </div>

      {workouts.length === 0 ? (
        <p className="text-sm ">No workout sessions to share yet.</p>
      ) : (
        <ul className="grid gap-3">
          {workouts.map((item) => (
            <li
              key={`${item.workout.id}-${item.savedAt}`}
              className="rounded-xl border border-slate-200 p-3"
            >
              <p className="font-medium ">{item.workout.name}</p>
              <p className="text-sm ">Workout date: {item.workout.date}</p>
              <p className="text-xs ">
                Saved: {new Date(item.savedAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
