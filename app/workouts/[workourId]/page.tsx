import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ExerciseCard from "@/components/workout/ExerciseCard";
import { workoutDays } from "@/lib/mock-data";

type WorkoutDetailsPageProps = {
  params: Promise<{ workoutId: string }>;
};

export default async function WorkoutDetailsPage({
  params,
}: WorkoutDetailsPageProps) {
  const { workoutId } = await params;

  const workout = workoutDays.find((day) => day.id === workoutId);

  if (!workout) {
    return (
      <AppShell>
        <PageHeader title="Workout not found" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title={workout.name}
        description={`Workout date: ${workout.date}`}
      />

      <div className="grid gap-6">
        {workout.exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </AppShell>
  );
}