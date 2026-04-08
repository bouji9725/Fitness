import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import WorkoutDayCard from "@/components/workout/WorkoutDayCard";
import { workoutTemplates } from "@/lib/mock-data";

export default function WorkoutsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Workouts"
          subtitle="Choose a workout template to start or continue a session."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workoutTemplates.map((template) => (
            <WorkoutDayCard key={template.id} workout={template} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}