export type NutritionGoal =
  | "lose-weight"
  | "gain-muscle"
  | "body-recomp"
  | "maintenance";

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

// ── Meal Breakdown Engine ─────────────────────────────────────────────────────

export type MealStructure =
  | "3-meals"
  | "3-meals-1-snack"
  | "3-meals-2-snacks"
  | "2-meals-1-snack"
  | "intermittent-fasting-16-8"
  | "training-day-split"
  | "rest-day-split";

export type DayType = "training" | "rest";

/** Shared macro shape used for both targets and logged actuals. */
export type MacroTarget = {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
};

/** One meal/snack slot within a day's breakdown plan. */
export type MealSlot = {
  index: number;
  name: string;       // e.g. "Breakfast", "Pre-workout", "Snack"
  timeLabel?: string; // display hint only, e.g. "~12:00" or "T−1 h"
  target: MacroTarget;
};

/** The full calculated breakdown for a single day. */
export type MealBreakdownPlan = {
  structure: MealStructure;
  dayType: DayType;
  dailyTarget: MacroTarget;
  slots: MealSlot[];
};

/** User's persisted meal planning preferences. */
export type MealPreference = {
  structure: MealStructure;
  dayType: DayType;
  workoutTime?: string;        // HH:MM — drives pre/post-workout slot timing
  fastingWindowStart?: string; // HH:MM — eating window start for 16:8
};

/** One meal log entry: what the user actually ate in a slot on a given date. */
export type MealLogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  slotIndex: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  notes?: string;
};

/** Per-day override of the saved nutrition plan targets (does not mutate the plan). */
export type DailyTargetOverride = {
  date: string; // YYYY-MM-DD
  calories?: number;
  proteinGrams?: number;
  carbsGrams?: number;
  fatGrams?: number;
};
