import Link from "next/link";
import Card from "../ui/Card";
import type { WorkoutDay } from "@/types/workout";

type WorkoutDayCardProps = {
  workout: WorkoutDay;
};

export default function WorkoutDayCard({ workout }: WorkoutDayCardProps) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold ">{workout.name}</h3>
          <p className="mt-1 text-sm ">{workout.date}</p>
          <p className="mt-3 text-sm ">
            {workout.exercises.length} exercise
            {workout.exercises.length > 1 ? "s" : ""}
          </p>
        </div>

        <Link
          href={`/workouts/${workout.id}`}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Open
        </Link>
      </div>
    </Card>
  );
}
