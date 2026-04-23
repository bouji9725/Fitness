"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import RecentWorkoutsList from "./RecentWorkoutsList";
import { loadAllWorkoutSessions } from "@/lib/data/workouts";
import { getDashboardMetrics } from "@/lib/data/dashboard";

// Main dashboard overview.
// This component translates saved workout data into a simple, scannable summary.
export default function DashboardOverview() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [metrics, setMetrics] = useState(() => getDashboardMetrics([]));

  useEffect(() => {
    const sessions = loadAllWorkoutSessions();
    const nextMetrics = getDashboardMetrics(sessions);

    setMetrics(nextMetrics);
    setHasHydrated(true);
  }, []);

  if (!hasHydrated) {
    return (
      <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
        Loading dashboard insights...
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* High-signal KPI row */}
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

      {/* Secondary overview row */}
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Summary
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Training snapshot
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