"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import WorkoutSession from "@/components/workout/WorkoutSession";
import type { WorkoutTemplate } from "@/types/workout";

// Workout session page.
// This is the highest-value workflow in the product.
// Keep the experience focused:
// - session context
// - exercise tracking
// - clear save/reset actions
export default function WorkoutDetailsPage() {
  const params = useParams();
  const workoutId = useMemo(() => {
    const rawValue = params?.workoutId;

    if (Array.isArray(rawValue)) {
      return rawValue[0] ?? "";
    }

    return rawValue ?? "";
  }, [params]);

  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/workout-templates");

        if (!response.ok) {
          throw new Error("Failed to load workout templates.");
        }

        const data: WorkoutTemplate[] = await response.json();
        const matchedTemplate = data.find((item) => item.id === workoutId) ?? null;

        if (!matchedTemplate) {
          throw new Error("Workout template not found.");
        }

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
      fetchTemplate();
    }
  }, [workoutId]);

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title={template?.name ?? "Workout session"}
          description="Log your sets, track exercise progress, and keep the session workflow focused and easy to scan."
          actions={
            <Link
              href="/workouts"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Back to workouts
            </Link>
          }
        />

        {loading ? (
          <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
            Loading workout...
          </section>
        ) : error ? (
          <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6">
            <p className="text-sm font-medium text-red-100">{error}</p>

            <Link
              href="/workouts"
              className="mt-4 inline-flex text-sm font-medium text-red-50 underline underline-offset-4"
            >
              Return to workouts
            </Link>
          </section>
        ) : !template ? (
          <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
            No workout session available.
          </section>
        ) : (
          <WorkoutSession template={template} />
        )}
      </PageContainer>
    </AppShell>
  );
}