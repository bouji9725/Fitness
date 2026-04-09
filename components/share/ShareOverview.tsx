"use client";

import { useEffect, useMemo, useState } from "react";
import SharePermissionCard from "./SharePermissionCard";
import ShareBodyStatsSummary from "./ShareBodyStatsSummary";
import ShareWorkoutSummary from "./ShareWorkoutSummary";
import ShareNutritionSummary from "./ShareNutritionSummary";
import SharePreviewCard from "./SharePreviewCard";
import ShareActionsCard from "./ShareActionsCard";
import ShareSummaryCard from "./ShareSummaryCard";
import { buildSharePayload } from "@/lib/data/share";
import { loadNutritionSummary } from "@/lib/data/nutrition";
import {
  loadProgressPhotos,
  loadBodyStats,
  loadInBodyEntries,
} from "@/lib/data/progress";
import { loadUserProfile, saveUserProfile } from "@/lib/data/profile";
import { loadAllWorkoutSessions } from "@/lib/data/workouts";
import type { UserProfile } from "@/types/profile";

export default function ShareOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bodyStats, setBodyStats] = useState(loadBodyStats());
  const [inBodyEntries, setInBodyEntries] = useState(loadInBodyEntries());
  const [progressPhotos, setProgressPhotos] = useState(loadProgressPhotos());
  const [savedWorkouts, setSavedWorkouts] = useState(loadAllWorkoutSessions());
  const [nutritionSummary, setNutritionSummary] = useState(loadNutritionSummary());

  useEffect(() => {
    const savedProfile = loadUserProfile();

    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      const fallbackProfile: UserProfile = {
        id: "user-1",
        name: "Abdel",
        goal: "gain-muscle",
        coachSharingEnabled: false,
        coachName: "Coach Budi",
      };

      setProfile(fallbackProfile);
      saveUserProfile(fallbackProfile);
    }

    setBodyStats(loadBodyStats());
    setInBodyEntries(loadInBodyEntries());
    setProgressPhotos(loadProgressPhotos());
    setSavedWorkouts(loadAllWorkoutSessions());
    setNutritionSummary(loadNutritionSummary());
  }, []);

  const payload = useMemo(() => {
    return buildSharePayload({
      coachName: profile?.coachName ?? "Coach Budi",
      sharingEnabled: profile?.coachSharingEnabled ?? false,
      bodyStats,
      inBodyEntries,
      progressPhotos,
      savedWorkouts,
      latestNutritionSummary: nutritionSummary,
    });
  }, [profile, bodyStats, inBodyEntries, progressPhotos, savedWorkouts, nutritionSummary]);

  function handleToggleSharing() {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      coachSharingEnabled: !profile.coachSharingEnabled,
    };

    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Loading share settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SharePermissionCard
        sharingEnabled={profile.coachSharingEnabled}
        coachName={profile.coachName ?? "Coach Budi"}
        onToggle={handleToggleSharing}
      />

      <ShareSummaryCard payload={payload} />
      <ShareBodyStatsSummary payload={payload} />
      <ShareWorkoutSummary payload={payload} />
      <ShareNutritionSummary nutrition={payload.latestNutritionSummary} />
      <SharePreviewCard payload={payload} />
      <ShareActionsCard payload={payload} />
    </div>
  );
}