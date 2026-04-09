
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import WorkoutDayCard from "@/components/workout/WorkoutTemplateDay";
import { workoutTemplates } from "@/lib/data/workout-templates";

export default function WorkoutsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Workouts"
          description="Choose a workout template to start or continue a session."
        />

        {workoutTemplates.length === 0 ? (
          <p className="text-sm text-slate-500">
            No workout templates available.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {workoutTemplates.map((template) => (
              <WorkoutDayCard key={template.id} workout={template} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}