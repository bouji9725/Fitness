"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
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
      <PageContainer>
        <PageHeader
          eyebrow="Workout templates"
          title="Workouts"
          description="Select a training template and move into a focused session logging flow."
          actions={
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View dashboard
            </Link>
          }
        />

        {loading ? (
          <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
            Loading workout templates...
          </section>
        ) : error ? (
          <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100">
            {error}
          </section>
        ) : templates.length === 0 ? (
          <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
            No workout templates are available yet.
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => {
              const previewExercises = template.exercises.slice(0, 3);

              return (
                <article
                  key={template.id}
                  className="app-surface rounded-[var(--radius-xl)] p-5 transition hover:border-indigo-400/30"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                    Training template
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    {template.name}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {template.exercises.length} exercise
                    {template.exercises.length === 1 ? "" : "s"} prepared for
                    this session.
                  </p>

                  <div className="mt-5 space-y-2">
                    {previewExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                      >
                        <p className="text-sm font-medium text-white">
                          {exercise.name}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                          {exercise.muscleGroup}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/workouts/${template.id}`}
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 px-4 text-sm font-medium text-white transition hover:bg-indigo-500/25"
                  >
                    Start session
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </PageContainer>
    </AppShell>
  );
}