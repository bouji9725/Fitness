import type {
  BodyStatsEntry,
  InBodyEntry,
  ProgressPhotoEntry,
} from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";

export type StoredWorkoutSession = WorkoutSessionRecord;

export type SharePayload = {
  coachName: string;
  sharingEnabled: boolean;
  latestBodyStats: BodyStatsEntry | null;
  latestInBody: InBodyEntry | null;
  latestPhoto: ProgressPhotoEntry | null;
  savedWorkouts: StoredWorkoutSession[];
  latestNutritionSummary: NutritionResults | null;
};
