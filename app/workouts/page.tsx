"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@frontend/components/layout/AppShell";
import PageContainer from "@frontend/components/layout/PageContainer";
import PageHeader from "@frontend/components/layout/PageHeader";
import Skeleton from "@frontend/components/ui/Skeleton";
import EmptyState from "@frontend/components/ui/EmptyState";
import { listWorkoutTemplates, createCustomWorkoutSession } from "@frontend/api/workouts-api";
import type { WorkoutTemplate } from "@shared/types/workout";

const BASE_MUSCLE_GROUPS = [
  "Back", "Biceps", "Calves", "Chest", "Core",
  "Forearms", "Full Body", "Glutes", "Hamstrings",
  "Legs", "Quads", "Shoulders", "Traps", "Triceps",
];

export default function WorkoutsPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [customName, setCustomName] = useState("");
  const [customMuscle, setCustomMuscle] = useState("");
  const [starting, setStarting] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true);
        setError(null);
        const data = await listWorkoutTemplates();
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong while loading workouts.");
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  async function handleStartCustom() {
    const name = customName.trim();
    if (!name) {
      setCustomError("Please enter a session name.");
      return;
    }
    try {
      setStarting(true);
      setCustomError(null);
      const label = customMuscle ? `${name} — ${customMuscle}` : name;
      const session = await createCustomWorkoutSession(label);
      router.push(`/workouts/${session.id}?s=1`);
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : "Failed to start session.");
      setStarting(false);
    }
  }

  const selectedTemplate = templates.find((t) => t.id === selectedId) ?? null;

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Workout plans"
          title="Workouts"
          description="Pick one of your saved plans or start a fresh custom session."
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
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="app-surface rounded-[var(--radius-xl)] p-5 space-y-4">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-48" />
                <div className="space-y-2">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
                <Skeleton className="h-11 w-32" />
              </div>
            ))}
          </section>
        ) : error ? (
          <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100">
            {error}
          </section>
        ) : templates.length === 0 ? (
          <EmptyState
            title="No templates available"
            description="Workout templates will appear here once they are added."
          />
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">

            {/* ── Card 1: saved templates ── */}
            <section className="app-surface flex flex-col rounded-[var(--radius-xl)] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                Your plans
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Previous workout plans
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Select a plan below to continue where you left off. Each plan comes pre-loaded with its exercises and your previous bests.
              </p>

              <div className="mt-5 flex-1 space-y-3">
                {templates.map((template) => {
                  const isSelected = selectedId === template.id;
                  const muscleGroups = [
                    ...new Set(template.exercises.map((e) => e.muscleGroup)),
                  ];

                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedId(isSelected ? null : template.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? "border-indigo-400/50 bg-indigo-500/15"
                          : "border-white/10 bg-white/5 hover:border-indigo-400/25 hover:bg-white/8"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-white">
                            {template.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {template.exercises.length} exercise{template.exercises.length !== 1 ? "s" : ""}
                            {muscleGroups.length > 0 && (
                              <span className="ml-2 text-slate-500">
                                · {muscleGroups.join(" · ")}
                              </span>
                            )}
                          </p>
                        </div>

                        <span
                          className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 transition ${
                            isSelected
                              ? "border-indigo-400 bg-indigo-400"
                              : "border-slate-600 bg-transparent"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                {selectedTemplate ? (
                  <Link
                    href={`/workouts/${selectedTemplate.id}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 px-5 text-sm font-medium text-white transition hover:bg-indigo-500/25"
                  >
                    Start session — {selectedTemplate.name}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-500">
                    Select a plan first
                  </span>
                )}
              </div>
            </section>

            {/* ── Card 2: custom session ── */}
            <section className="app-surface flex flex-col rounded-[var(--radius-xl)] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                New session
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Start something new
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Name your session, choose a muscle focus, and jump in. You&apos;ll add exercises once the session starts — all your personal bests will still be tracked.
              </p>

              <div className="mt-6 flex-1 space-y-4">
                <div>
                  <label
                    htmlFor="custom-session-name"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"
                  >
                    Session name
                  </label>
                  <input
                    id="custom-session-name"
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleStartCustom()}
                    placeholder="e.g. Push Day, Full Body, Upper Body…"
                    className="min-h-11 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="custom-session-muscle"
                    className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400"
                  >
                    Muscle focus <span className="font-normal normal-case text-slate-500">(optional)</span>
                  </label>
                  <select
                    id="custom-session-muscle"
                    value={customMuscle}
                    onChange={(e) => setCustomMuscle(e.target.value)}
                    className="min-h-11 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">
                      No specific focus
                    </option>
                    {BASE_MUSCLE_GROUPS.map((g) => (
                      <option key={g} value={g} className="bg-slate-900">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {customError && (
                  <p className="text-sm text-red-400">{customError}</p>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleStartCustom}
                  disabled={starting || !customName.trim()}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-5 text-sm font-medium text-white transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {starting ? "Starting…" : "Start session"}
                </button>
              </div>
            </section>

          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
