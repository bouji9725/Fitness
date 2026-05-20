"use client";

import { useEffect, useMemo, useState } from "react";
import { getProfile } from "@frontend/api/profile-api";
import { getNutritionSummary } from "@frontend/api/nutrition-api";
import { listProgressEntries } from "@frontend/api/progress-api";
import { listActiveWorkoutSessions, listSavedWorkoutSessions } from "@frontend/api/workouts-api";
import { getLatestBodyStats } from "@shared/calculations/progress";
import DashboardHero from "./DashboardHero";
import SetupChecklistCard from "./SetupChecklistCard";
import NextActionCard from "./NextActionCard";
import DashboardMetricGrid from "./DashboardMetricGrid";
import RecentActivityCard from "./RecentActivityCard";
import RecentWorkoutsList from "./RecentWorkoutsList";
import ResumeSessionBanner from "./ResumeSessionBanner";
import Skeleton from "@frontend/components/ui/Skeleton";
import type { UserProfile } from "@shared/types/profile";
import type { NutritionResults } from "@shared/types/nutrition";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { WorkoutSession, WorkoutSessionRecord } from "@shared/types/workout";

export default function DashboardOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nutritionSummary, setNutritionSummary] =
    useState<NutritionResults | null>(null);
  const [progressEntries, setProgressEntries] = useState<BodyStatsEntry[]>([]);
  const [savedSessions, setSavedSessions] = useState<WorkoutSessionRecord[]>([]);
  const [activeSessions, setActiveSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError(null);
        const [profileData, nutritionData, progressData, sessionsData, activeData] =
          await Promise.all([
            getProfile(),
            getNutritionSummary(),
            listProgressEntries(),
            listSavedWorkoutSessions(),
            listActiveWorkoutSessions(),
          ]);
        setProfile(profileData);
        setNutritionSummary(nutritionData);
        setProgressEntries(progressData);
        setSavedSessions(sessionsData);
        setActiveSessions(activeData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong loading the dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const latestBodyStats = useMemo(
    () => getLatestBodyStats(progressEntries),
    [progressEntries]
  );

  const lastTrainingDay = useMemo(() => {
    if (savedSessions.length === 0) return null;
    return [...savedSessions].sort(
      (a, b) =>
        new Date(b.session.performedAt).getTime() -
        new Date(a.session.performedAt).getTime()
    )[0].session.performedAt;
  }, [savedSessions]);

  const hasProfile = Boolean(
    profile?.name?.trim() &&
      profile?.age &&
      profile?.heightCm &&
      profile?.sex
  );

  const isNewUser = !hasProfile && progressEntries.length === 0 && savedSessions.length === 0;

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Hero */}
        <Skeleton className="h-40 rounded-[var(--radius-xl)]" />
        {/* Metric grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
        </div>
        {/* Next action + setup checklist */}
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-44 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-44 rounded-[var(--radius-xl)]" />
        </div>
        {/* Recent activity + workouts list */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
          <Skeleton className="h-56 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-56 rounded-[var(--radius-xl)]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100">
        {error}
      </section>
    );
  }

  const setupSection = (
    <div className="grid gap-6 xl:grid-cols-2">
      <NextActionCard
        profile={profile}
        latestBodyStats={latestBodyStats}
        nutritionSummary={nutritionSummary}
        savedWorkouts={savedSessions}
      />
      <SetupChecklistCard
        hasProfile={hasProfile}
        hasProgressEntry={progressEntries.length > 0}
        hasNutritionPlan={nutritionSummary !== null}
        hasWorkout={savedSessions.length > 0}
        hasSharingEnabled={Boolean(profile?.coachSharingEnabled)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Resume session banner — shown when the user has an unsaved active session */}
      <ResumeSessionBanner sessions={activeSessions} />

      {/* Personalised welcome card */}
      <DashboardHero
        profile={profile}
        latestBodyStats={latestBodyStats}
        nutritionSummary={nutritionSummary}
        recentWorkout={savedSessions[0] ?? null}
      />

      {/* New users see the setup/next-action before the metric grid */}
      {isNewUser && setupSection}

      {/* Key metrics: nutrition target · weight · workouts */}
      <DashboardMetricGrid
        nutritionSummary={nutritionSummary}
        latestBodyStats={latestBodyStats}
        savedWorkoutsCount={savedSessions.length}
        lastTrainingDay={lastTrainingDay}
      />

      {/* Returning users see setup after the metric grid */}
      {!isNewUser && setupSection}

      {/* Recent activity + full workouts list */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <RecentActivityCard
          latestBodyStats={latestBodyStats}
          recentWorkouts={savedSessions.slice(0, 3)}
        />
        <RecentWorkoutsList items={savedSessions.slice(0, 5)} />
      </div>
    </div>
  );
}
