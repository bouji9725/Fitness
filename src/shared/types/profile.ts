import type { NutritionGoal } from "./nutrition";

export type UserProfile = {
  id: string;
  name: string;
  sex?: "male" | "female";
  age?: number;
  heightCm?: number;
  goal?: NutritionGoal;
  coachSharingEnabled: boolean;
  coachName?: string;
};
