"use client";

import { useEffect, useMemo, useState } from "react";
import { listSavedWorkoutSessions } from "@frontend/api/workouts-api";
import {
  getWeeklyVolume,
  getMuscleGroupVolume,
  getWorkoutDates,
} from "@shared/calculations/dashboard";
import VolumeOverTimeChart from "./VolumeOverTimeChart";
import WorkoutConsistencyCalendar from "./WorkoutConsistencyCalendar";
import MuscleGroupBreakdown from "./MuscleGroupBreakdown";
import Skeleton from "@frontend/components/ui/Skeleton";
import type { WorkoutSessionRecord } from "@shared/types/workout";

export default function DashboardChartsSection() {
  const [sessions, setSessions] = useState<WorkoutSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSavedWorkoutSessions({ limit: 200, offset: 0 })
      .then((page) => setSessions(page.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const weeklyVolume = useMemo(() => getWeeklyVolume(sessions), [sessions]);
  const muscleVolume = useMemo(() => getMuscleGroupVolume(sessions), [sessions]);
  const workoutDates = useMemo(() => getWorkoutDates(sessions), [sessions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <Skeleton className="h-64 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-64 rounded-[var(--radius-xl)]" />
        </div>
        <Skeleton className="h-52 rounded-[var(--radius-xl)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Volume over time */}
        <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Training volume
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Volume over time
          </h2>
          <p className="mt-1 mb-5 text-sm text-slate-400">
            Total kg lifted per week — last 8 weeks
          </p>
          <VolumeOverTimeChart data={weeklyVolume} />
        </section>

        {/* Muscle group breakdown */}
        <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Muscle focus
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
            By muscle group
          </h2>
          <p className="mt-1 mb-5 text-sm text-slate-400">
            Volume split across all sessions
          </p>
          <MuscleGroupBreakdown data={muscleVolume} />
        </section>
      </div>

      {/* Consistency calendar */}
      <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Consistency
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Training calendar
        </h2>
        <p className="mt-1 mb-5 text-sm text-slate-400">
          Days you trained — last 13 weeks
        </p>
        <WorkoutConsistencyCalendar workoutDates={workoutDates} />
      </section>
    </div>
  );
}
