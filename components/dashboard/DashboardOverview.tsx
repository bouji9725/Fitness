"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import RecentWorkoutsList from "./RecentWorkoutsList";
import WorkoutInsightCard from "./WorkoutInsightCard";
import { getDashboardMetrics } from "@/lib/calculations/dashboard";
import { listSavedWorkoutSessions } from "@/lib/api/workouts-api";

// Main dashboard overview.
// Reads saved workout data through the API client.
export default function DashboardOverview() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState(() => getDashboardMetrics([]));

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setError(null);

        const sessions = await listSavedWorkoutSessions();
        const nextMetrics = getDashboardMetrics(sessions);

        setMetrics(nextMetrics);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading dashboard data."
        );
      } finally {
        setHasHydrated(true);
      }
    }

    loadDashboardData();
  }, []);

  if (!hasHydrated) {
    return (
      <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
        Loading dashboard insights...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100">
        {error}
      </section>
    );
  }

  const averageExercisesPerWorkout =
    metrics.totalSavedWorkouts > 0
      ? (metrics.totalExercisesLogged / metrics.totalSavedWorkouts).toFixed(1)
      : "0";

  const averageSetsPerWorkout =
    metrics.totalSavedWorkouts > 0
      ? (metrics.totalCompletedSets / metrics.totalSavedWorkouts).toFixed(1)
      : "0";

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Saved workouts"
          value={metrics.totalSavedWorkouts}
          helperText="Completed sessions stored in your history."
        />
        <StatCard
          label="Exercises logged"
          value={metrics.totalExercisesLogged}
          helperText="Total exercise entries across saved sessions."
        />
        <StatCard
          label="Completed sets"
          value={metrics.totalCompletedSets}
          helperText="Sets marked as completed in your saved history."
        />
        <StatCard
          label="Total volume"
          value={metrics.totalVolume}
          helperText="Combined training volume across saved workouts."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <WorkoutInsightCard
          title="Training consistency"
          description="A simple view of how much history has already been built."
          value={metrics.totalSavedWorkouts}
          helperText="Each saved session strengthens your training history."
        />

        <WorkoutInsightCard
          title="Average exercises"
          description="How dense your typical saved workout currently is."
          value={averageExercisesPerWorkout}
          helperText="Exercises per saved workout session."
        />

        <WorkoutInsightCard
          title="Average completed sets"
          description="How much work gets completed in a typical workout."
          value={averageSetsPerWorkout}
          helperText="Completed sets per saved workout session."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Summary
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Workout history snapshot
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Use this overview to understand how much training data has been
            captured so far and how active your recent workout history looks.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Recent workout entries</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {metrics.recentWorkouts.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Up to five of your latest saved sessions are shown in the activity
              panel.
            </p>
          </div>
        </div>

        <RecentWorkoutsList items={metrics.recentWorkouts} />
      </section>
    </div>
  );
}