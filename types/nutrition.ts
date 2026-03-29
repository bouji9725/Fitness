export type NutritionGoal =
  | "lose-weight"
  | "gain-muscle"
  | "body-recomp";

export type RecompDirection = "slight-deficit" | "slight-surplus";

export type NutritionInputs = {
  weightKg: number;
  bodyFatPercent: number;
  bmr: number;
  tdee: number;
  goal: NutritionGoal;
  adjustment: number;
  recompDirection: RecompDirection;
};

export type NutritionResults = {
  fatFreeMassKg: number;
  fatFreeMassLbs: number;
  proteinFactor: number;
  proteinTargetGrams: number;
  calorieTarget: number;
  fatPercent: number;
  fatTargetGrams: number;
  carbsTargetGrams: number;
  proteinCalories: number;
  fatCalories: number;
  carbCalories: number;
};