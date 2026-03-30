import type { BodyStatsEntry, InBodyEntry, ProgressPhotoEntry } from "@/types/progress";
import type { NutritionResults } from "@/types/nutrition";
import type { WorkoutDay } from "@/types/workout";

export type StoredWorkoutSession = {
  workout: WorkoutDay;
  savedAt: string;
};

export type SharePayload = {
  coachName: string;
  sharingEnabled: boolean;
  latestBodyStats: BodyStatsEntry | null;
  latestInBody: InBodyEntry | null;
  latestPhoto: ProgressPhotoEntry | null;
  savedWorkouts: StoredWorkoutSession[];
  latestNutritionSummary: NutritionResults | null;
};