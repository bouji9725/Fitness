"use client";

import { useEffect, useMemo, useState } from "react";
import { getProfile } from "@frontend/api/profile-api";
import { listProgressEntries } from "@frontend/api/progress-api";
import { getNutritionSummary } from "@frontend/api/nutrition-api";
import { listSavedWorkoutSessions } from "@frontend/api/workouts-api";
import { getLatestBodyStats } from "@shared/calculations/progress";
import ShareReadinessCard from "./ShareReadinessCard";
import CoachReportPreview from "./CoachReportPreview";
import ShareActionsCard from "./ShareActionsCard";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";
import type { SharePayload } from "@shared/types/share";

type ShareData = {
  profile: UserProfile | null;
  progressEntries: BodyStatsEntry[];
  nutritionSummary: NutritionResults | null;
  workoutHistory: WorkoutSessionRecord[];
};

export default function ShareOverview() {
  const [data, setData] = useState<ShareData>({
    profile: null,
    progressEntries: [],
    nutritionSummary: null,
    workoutHistory: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadShareData() {
      try {
        setLoading(true);
        setError(null);
        const [profile, progressEntries, nutritionSummary, workoutHistory] =
          await Promise.all([
            getProfile(),
            listProgressEntries(),
            getNutritionSummary(),
            listSavedWorkoutSessions(),
          ]);
        setData({ profile, progressEntries, nutritionSummary, workoutHistory });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong loading the share summary."
        );
      } finally {
        setLoading(false);
      }
    }
    loadShareData();
  }, []);

  const latestBodyStats = useMemo(
    () => getLatestBodyStats(data.progressEntries),
    [data.progressEntries]
  );

  const recentWorkouts = useMemo(
    () => data.workoutHistory.slice(0, 5),
    [data.workoutHistory]
  );

  const sharePayload: SharePayload = useMemo(
    () => ({
      coachName: data.profile?.coachName?.trim() || "",
      sharingEnabled: Boolean(data.profile?.coachSharingEnabled),
      latestBodyStats,
      latestInBody: null,
      latestPhoto: null,
      savedWorkouts: recentWorkouts,
      latestNutritionSummary: data.nutritionSummary,
    }),
    [data.profile, latestBodyStats, recentWorkouts, data.nutritionSummary]
  );

  if (loading) {
    return (
      <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
        Loading share summary...
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

  return (
    <div className="space-y-6">
      <ShareReadinessCard
        profile={data.profile}
        latestBodyStats={latestBodyStats}
        nutritionSummary={data.nutritionSummary}
        savedWorkouts={data.workoutHistory}
      />

      <CoachReportPreview
        profile={data.profile}
        latestBodyStats={latestBodyStats}
        nutritionSummary={data.nutritionSummary}
        recentWorkouts={recentWorkouts}
        totalWorkouts={data.workoutHistory.length}
      />

      <ShareActionsCard payload={sharePayload} />
    </div>
  );
}
