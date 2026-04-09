import type {
  BodyStatsEntry,
  InBodyEntry,
  ProgressPhotoEntry,
} from "@/types/progress";
import type { NutritionResults } from "@/types/nutrition";
import type { SharePayload, StoredWorkoutSession } from "@/types/share";

export function getLatestEntry<T extends { date: string }>(items: T[]): T | null {
  if (items.length === 0) return null;

  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}

export function buildSharePayload(params: {
  coachName: string;
  sharingEnabled: boolean;
  bodyStats: BodyStatsEntry[];
  inBodyEntries: InBodyEntry[];
  progressPhotos: ProgressPhotoEntry[];
  savedWorkouts: StoredWorkoutSession[];
  latestNutritionSummary: NutritionResults | null;
}): SharePayload {
  return {
    coachName: params.coachName,
    sharingEnabled: params.sharingEnabled,
    latestBodyStats: getLatestEntry(params.bodyStats),
    latestInBody: getLatestEntry(params.inBodyEntries),
    latestPhoto: getLatestEntry(params.progressPhotos),
    savedWorkouts: params.savedWorkouts.slice(0, 5),
    latestNutritionSummary: params.latestNutritionSummary,
  };
}