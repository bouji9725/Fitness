"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/ui/StatCard";
import RecentWorkoutsList from "./RecentWorkoutsList";
import { loadAllWorkoutSessions } from "@/lib/data/workouts";
import { getDashboardMetrics } from "@/lib/data/dashboard";

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
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Loading dashboard insights...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Saved Workouts"
          value={metrics.totalSavedWorkouts}
        />
        <StatCard
          label="Exercises Logged"
          value={metrics.totalExercisesLogged}
        />
        <StatCard
          label="Completed Sets"
          value={metrics.totalCompletedSets}
        />
        <StatCard
          label="Total Volume"
          value={metrics.totalVolume}
        />
      </div>

      <RecentWorkoutsList items={metrics.recentWorkouts} />
    </div>
  );
}