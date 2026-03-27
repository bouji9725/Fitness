import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import WorkoutDayCard from "@/components/workout/WorkoutDayCard";
import { workoutDays } from "@/lib/mock-data";

export default function WorkoutsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Workouts"
        description="Choose a workout day to log sets, reps, and weight."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workoutDays.map((workout) => (
          <WorkoutDayCard key={workout.id} workout={workout} />
        ))}
      </div>
    </AppShell>
  );
}