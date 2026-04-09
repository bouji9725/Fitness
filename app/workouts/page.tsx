"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import WorkoutDayCard from "@/components/workout/WorkoutTemplateDay";
import type { WorkoutTemplate } from "@/types/workout";

export default function WorkoutsPage() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/workout-templates");

        if (!response.ok) {
          throw new Error("Failed to load workout templates.");
        }

        const data: WorkoutTemplate[] = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading workouts."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Workouts"
          description="Choose a workout template to start or continue a session."
        />

        {loading ? (
          <p className="text-sm text-slate-500">Loading workout templates...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : templates.length === 0 ? (
          <p className="text-sm text-slate-500">
            No workout templates available.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <WorkoutDayCard key={template.id} workout={template} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}