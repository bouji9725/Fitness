"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getProfile } from "@frontend/api/profile-api";
import { getNutritionSummary } from "@frontend/api/nutrition-api";
import { listProgressEntries } from "@frontend/api/progress-api";
import {
  listActiveWorkoutSessions,
  deleteWorkoutSession,
  listSavedWorkoutSessions,
} from "@frontend/api/workouts-api";
import { getLatestBodyStats } from "@shared/calculations/progress";
import DashboardHero from "./DashboardHero";
import SetupChecklistCard from "./SetupChecklistCard";
import NextActionCard from "./NextActionCard";
import DashboardMetricGrid from "./DashboardMetricGrid";
import RecentActivityCard from "./RecentActivityCard";
import RecentWorkoutsList from "./RecentWorkoutsList";
import ResumeSessionBanner from "./ResumeSessionBanner";
import PersonalRecordsCard from "./PersonalRecordsCard";
import TodayNutritionCard from "./TodayNutritionCard";
import DashboardChartsSection from "./DashboardChartsSection";
import Skeleton from "@frontend/components/ui/Skeleton";
import type { UserProfile } from "@shared/types/profile";
import type { NutritionResults } from "@shared/types/nutrition";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { WorkoutSession, WorkoutSessionRecord } from "@shared/types/workout";

const PAGE_SIZE = 10;

export default function DashboardOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [nutritionSummary, setNutritionSummary] =
    useState<NutritionResults | null>(null);
  const [progressEntries, setProgressEntries] = useState<BodyStatsEntry[]>([]);
  const [sessions, setSessions] = useState<WorkoutSessionRecord[]>([]);
  const [activeSessions, setActiveSessions] = useState<WorkoutSession[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError(null);
        const [profileData, nutritionData, progressData, sessionsPage, activeData] =
          await Promise.all([
            getProfile(),
            getNutritionSummary(),
            listProgressEntries(),
            listSavedWorkoutSessions({ limit: PAGE_SIZE, offset: 0 }),
            listActiveWorkoutSessions(),
          ]);
        setProfile(profileData);
        setNutritionSummary(nutritionData);
        setProgressEntries(progressData);
        setSessions(sessionsPage.data);
        setTotalSessions(sessionsPage.total);
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

  const handleLoadMore = useCallback(async () => {
    try {
      setLoadingMore(true);
      const page = await listSavedWorkoutSessions({
        limit: PAGE_SIZE,
        offset: sessions.length,
      });
      setSessions((prev) => [...prev, ...page.data]);
      setTotalSessions(page.total);
    } finally {
      setLoadingMore(false);
    }
  }, [sessions.length]);

  const handleDelete = useCallback(async (sessionId: string) => {
    await deleteWorkoutSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.session.id !== sessionId));
    setTotalSessions((prev) => prev - 1);
  }, []);

  const latestBodyStats = useMemo(
    () => getLatestBodyStats(progressEntries),
    [progressEntries]
  );

  const lastTrainingDay = useMemo(() => {
    if (sessions.length === 0) return null;
    return [...sessions].sort(
      (a, b) =>
        new Date(b.session.performedAt).getTime() -
        new Date(a.session.performedAt).getTime()
    )[0].session.performedAt;
  }, [sessions]);

  const hasProfile = Boolean(
    profile?.name?.trim() &&
      profile?.age &&
      profile?.heightCm &&
      profile?.sex
  );

  const isNewUser = !hasProfile && progressEntries.length === 0 && totalSessions === 0;
  const hasMore = sessions.length < totalSessions;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-[var(--radius-xl)]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Skeleton className="h-44 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-44 rounded-[var(--radius-xl)]" />
        </div>
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
        savedWorkouts={sessions}
      />
      <SetupChecklistCard
        hasProfile={hasProfile}
        hasProgressEntry={progressEntries.length > 0}
        hasNutritionPlan={nutritionSummary !== null}
        hasWorkout={totalSessions > 0}
        hasSharingEnabled={Boolean(profile?.coachSharingEnabled)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <ResumeSessionBanner sessions={activeSessions} />

      <DashboardHero
        profile={profile}
        latestBodyStats={latestBodyStats}
        nutritionSummary={nutritionSummary}
        recentWorkout={sessions[0] ?? null}
      />

      {isNewUser && setupSection}

      <DashboardMetricGrid
        nutritionSummary={nutritionSummary}
        latestBodyStats={latestBodyStats}
        savedWorkoutsCount={totalSessions}
        lastTrainingDay={lastTrainingDay}
      />

      {!isNewUser && setupSection}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <RecentActivityCard
          latestBodyStats={latestBodyStats}
          recentWorkouts={sessions.slice(0, 3)}
        />
        <RecentWorkoutsList
          items={sessions}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onLoadMore={handleLoadMore}
          onDelete={handleDelete}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <PersonalRecordsCard sessions={sessions} />
        <TodayNutritionCard />
      </div>

      <DashboardChartsSection />
    </div>
  );
}
