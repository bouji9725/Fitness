import type { UserProfile } from "@/types/profile";
import type { BodyStatsEntry, InBodyEntry, ProgressPhotoEntry } from "@/types/progress";
import type { NutritionResults } from "@/types/nutrition";

const NUTRITION_SUMMARY_KEY = "fittrack:nutrition-summary";
const PROFILE_KEY = "fittrack:user-profile";
const BODY_STATS_KEY = "fittrack:body-stats";
const PROGRESS_PHOTOS_KEY = "fittrack:progress-photos";
const INBODY_KEY = "fittrack:inbody-entries";

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveBodyStats(entries: BodyStatsEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BODY_STATS_KEY, JSON.stringify(entries));
}

export function loadBodyStats(): BodyStatsEntry[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(BODY_STATS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as BodyStatsEntry[];
  } catch {
    return [];
  }
}

export function saveProgressPhotos(entries: ProgressPhotoEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_PHOTOS_KEY, JSON.stringify(entries));
}

export function loadProgressPhotos(): ProgressPhotoEntry[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(PROGRESS_PHOTOS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as ProgressPhotoEntry[];
  } catch {
    return [];
  }
}

export function saveInBodyEntries(entries: InBodyEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INBODY_KEY, JSON.stringify(entries));
}

export function loadInBodyEntries(): InBodyEntry[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(INBODY_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as InBodyEntry[];
  } catch {
    return [];
  }
}
export function saveNutritionSummary(summary: NutritionResults): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NUTRITION_SUMMARY_KEY, JSON.stringify(summary));
}

export function loadNutritionSummary(): NutritionResults | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(NUTRITION_SUMMARY_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as NutritionResults;
  } catch {
    return null;
  }
}