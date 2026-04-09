import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import WorkoutSession from "@/components/workout/WorkoutSession";
import { workoutTemplates } from "@/lib/data/workout-templates";

type WorkoutDetailsPageProps = {
  params: Promise<{ workoutId: string }>;
};

export default async function WorkoutDetailsPage({
  params,
}: WorkoutDetailsPageProps) {
  const { workoutId } = await params;

  const template = workoutTemplates.find((item) => item.id === workoutId);

  if (!template) {
    return (
      <AppShell>
        <div className="space-y-4">
          <PageHeader
            title="Workout not found"
            description="The requested workout template does not exist."
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={template.name}
          description="Start or continue your workout session."
        />
        <WorkoutSession template={template} />
      </div>
    </AppShell>
  );
}