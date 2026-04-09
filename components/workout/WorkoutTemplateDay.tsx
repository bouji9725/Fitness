import Link from "next/link";
import Card from "../ui/Card";
import type { WorkoutTemplate } from "@/types/workout";

type WorkoutDayCardProps = {
  workout: WorkoutTemplate;
};

export default function WorkoutDayCard({ workout }: WorkoutDayCardProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">{workout.name}</h3>
        <p className="text-sm text-slate-500">
          {workout.exercises.length} exercise
          {workout.exercises.length > 1 ? "s" : ""}
        </p>
      </div>

      <Link
        href={`/workouts/${workout.id}`}
        className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
      >
        Open
      </Link>
    </Card>
  );
}