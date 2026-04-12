"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import WorkoutSession from "@/components/workout/WorkoutSession";
import type { WorkoutTemplate } from "@/types/workout";

export default function WorkoutDetailsPage() {
  const params = useParams();
  const workoutId = params.workoutId as string;

  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplateFromCollection() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/workout-templates");

        if (!response.ok) {
          throw new Error("Failed to load workout templates.");
        }

        const data: WorkoutTemplate[] = await response.json();
        const matchedTemplate =
          data.find((item) => item.id === workoutId) ?? null;

        setTemplate(matchedTemplate);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the workout."
        );
      } finally {
        setLoading(false);
      }
    }

    if (workoutId) {
      fetchTemplateFromCollection();
    }
  }, [workoutId]);

  if (loading) {
    return (
      <AppShell>
        <p className="text-sm text-slate-500">Loading workout...</p>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <PageHeader title="Error" description={error} />
      </AppShell>
    );
  }

  if (!template) {
    return (
      <AppShell>
        <PageHeader
          title="Workout not found"
          description="The requested workout template does not exist."
        />
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