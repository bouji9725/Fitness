"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import AppShell from "@frontend/components/layout/AppShell";
import PageContainer from "@frontend/components/layout/PageContainer";
import PageHeader from "@frontend/components/layout/PageHeader";
import Skeleton from "@frontend/components/ui/Skeleton";
import WorkoutSession from "@frontend/components/workout/WorkoutSession";
import { getWorkoutSession } from "@frontend/api/workouts-api";
import type { WorkoutSession as WorkoutSessionType, WorkoutTemplate } from "@shared/types/workout";

export default function WorkoutDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const workoutId = useMemo(() => {
    const rawValue = params?.workoutId;
    return Array.isArray(rawValue) ? (rawValue[0] ?? "") : (rawValue ?? "");
  }, [params]);

  const isCustomSession = searchParams.get("s") === "1";

  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [initialSession, setInitialSession] = useState<WorkoutSessionType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workoutId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (isCustomSession) {
          const session = await getWorkoutSession(workoutId);
          setInitialSession(session);
          setTemplate({ id: workoutId, name: session.templateName, exercises: [] });
        } else {
          const response = await fetch("/api/workout-templates");
          if (!response.ok) throw new Error("Failed to load workout templates.");
          const data: WorkoutTemplate[] = await response.json();
          const matched = data.find((t) => t.id === workoutId) ?? null;
          if (!matched) throw new Error("Workout template not found.");
          setTemplate(matched);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong while loading the workout.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [workoutId, isCustomSession]);

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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="app-surface rounded-[var(--radius-xl)] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            ))}
          </div>
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
          <WorkoutSession template={template} initialSession={initialSession} />
        )}
      </PageContainer>
    </AppShell>
  );
}
