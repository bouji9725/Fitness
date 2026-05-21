import type {
  DayType,
  MacroTarget,
  MealBreakdownPlan,
  MealSlot,
  MealStructure,
  NutritionInputs,
  NutritionResults,
} from "@shared/types/nutrition";

export function calculateMifflinStJeorBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: "male" | "female"
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === "male" ? base + 5 : base - 161);
}

export function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return kg * 2.2;
}

export function calculateFatFreeMassKg(
  weightKg: number,
  bodyFatPercent: number
): number {
  const bodyFatDecimal = bodyFatPercent / 100;
  return weightKg * (1 - bodyFatDecimal);
}

export function getProteinFactor(bodyFatPercent: number): number {
  const minBodyFat = 10;
  const maxBodyFat = 35;
  const maxFactor = 1.6;
  const minFactor = 1.2;

  if (bodyFatPercent <= minBodyFat) return maxFactor;
  if (bodyFatPercent >= maxBodyFat) return minFactor;

  const ratio = (bodyFatPercent - minBodyFat) / (maxBodyFat - minBodyFat);
  const factor = maxFactor - ratio * (maxFactor - minFactor);

  return roundToOneDecimal(factor);
}

export function calculateProteinTarget(
  fatFreeMassLbs: number,
  proteinFactor: number
): number {
  return fatFreeMassLbs * proteinFactor;
}

export function calculateCalorieTarget(inputs: NutritionInputs): number {
  const { tdee, bmr, goal, adjustment, recompDirection } = inputs;

  if (goal === "lose-weight") {
    return Math.max(bmr, tdee - adjustment);
  }

  if (goal === "gain-muscle") {
    return tdee + adjustment;
  }

  if (goal === "body-recomp") {
    if (recompDirection === "slight-deficit") {
      return Math.max(bmr, tdee - adjustment);
    }

    return tdee + adjustment;
  }

  // "maintenance"
  return tdee;
}

export function getFatPercent(inputs: NutritionInputs): number {
  const { goal, recompDirection } = inputs;

  if (goal === "lose-weight") return 0.2;
  if (goal === "gain-muscle") return 0.3;

  if (goal === "body-recomp") {
    return recompDirection === "slight-deficit" ? 0.2 : 0.25;
  }

  // "maintenance"
  return 0.25;
}

export function calculateNutritionResults(
  inputs: NutritionInputs
): NutritionResults {
  const fatFreeMassKg = calculateFatFreeMassKg(
    inputs.weightKg,
    inputs.bodyFatPercent
  );

  const fatFreeMassLbs = kgToLbs(fatFreeMassKg);
  const proteinFactor = getProteinFactor(inputs.bodyFatPercent);
  const proteinTargetGrams = calculateProteinTarget(
    fatFreeMassLbs,
    proteinFactor
  );

  const calorieTarget = calculateCalorieTarget(inputs);
  const fatPercent = getFatPercent(inputs);

  const proteinCalories = proteinTargetGrams * 4;
  const fatCalories = calorieTarget * fatPercent;
  const fatTargetGrams = fatCalories / 9;

  const remainingCalories = Math.max(
    0,
    calorieTarget - proteinCalories - fatCalories
  );
  const carbsTargetGrams = remainingCalories / 4;
  const carbCalories = carbsTargetGrams * 4;

  return {
    fatFreeMassKg: roundToOneDecimal(fatFreeMassKg),
    fatFreeMassLbs: roundToOneDecimal(fatFreeMassLbs),
    proteinFactor: roundToOneDecimal(proteinFactor),
    proteinTargetGrams: roundToOneDecimal(proteinTargetGrams),
    calorieTarget: roundToOneDecimal(calorieTarget),
    fatPercent: roundToOneDecimal(fatPercent * 100),
    fatTargetGrams: roundToOneDecimal(fatTargetGrams),
    carbsTargetGrams: roundToOneDecimal(carbsTargetGrams),
    proteinCalories: roundToOneDecimal(proteinCalories),
    fatCalories: roundToOneDecimal(fatCalories),
    carbCalories: roundToOneDecimal(carbCalories),
  };
}

// ── Meal Breakdown Engine ──────────────────────────────────────────────────────

type SlotTemplate = {
  name: string;
  timeLabel?: string;
  protFrac: number;
  carbFrac: number;
  fatFrac: number;
};

// Adds `minutes` (positive or negative) to an HH:MM string.
function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = ((h * 60 + m + minutes) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

// Distributes `total` across `fracs` as rounded integers.
// The last slot absorbs rounding error so the sum always equals Math.round(total).
function distributeValue(total: number, fracs: number[]): number[] {
  let remaining = Math.round(total);
  const result: number[] = [];
  for (let i = 0; i < fracs.length - 1; i++) {
    const v = Math.round(total * fracs[i]);
    result.push(v);
    remaining -= v;
  }
  result.push(Math.max(0, remaining));
  return result;
}

function getSlotTemplates(
  structure: MealStructure,
  options?: { workoutTime?: string; fastingWindowStart?: string }
): SlotTemplate[] {
  switch (structure) {
    case "3-meals":
      return [
        { name: "Breakfast", protFrac: 0.30, carbFrac: 0.30, fatFrac: 0.30 },
        { name: "Lunch",     protFrac: 0.35, carbFrac: 0.35, fatFrac: 0.35 },
        { name: "Dinner",    protFrac: 0.35, carbFrac: 0.35, fatFrac: 0.35 },
      ];

    case "3-meals-1-snack":
      return [
        { name: "Breakfast", protFrac: 0.25, carbFrac: 0.25, fatFrac: 0.25 },
        { name: "Snack",     protFrac: 0.15, carbFrac: 0.15, fatFrac: 0.15 },
        { name: "Lunch",     protFrac: 0.30, carbFrac: 0.30, fatFrac: 0.30 },
        { name: "Dinner",    protFrac: 0.30, carbFrac: 0.30, fatFrac: 0.30 },
      ];

    case "3-meals-2-snacks":
      return [
        { name: "Breakfast", protFrac: 0.25, carbFrac: 0.25, fatFrac: 0.25 },
        { name: "Snack 1",   protFrac: 0.10, carbFrac: 0.10, fatFrac: 0.10 },
        { name: "Lunch",     protFrac: 0.30, carbFrac: 0.30, fatFrac: 0.30 },
        { name: "Snack 2",   protFrac: 0.10, carbFrac: 0.10, fatFrac: 0.10 },
        { name: "Dinner",    protFrac: 0.25, carbFrac: 0.25, fatFrac: 0.25 },
      ];

    case "2-meals-1-snack":
      return [
        { name: "Meal 1", protFrac: 0.40, carbFrac: 0.40, fatFrac: 0.40 },
        { name: "Snack",  protFrac: 0.20, carbFrac: 0.20, fatFrac: 0.20 },
        { name: "Meal 2", protFrac: 0.40, carbFrac: 0.40, fatFrac: 0.40 },
      ];

    case "intermittent-fasting-16-8": {
      const start = options?.fastingWindowStart ?? "12:00";
      const meal2 = addMinutes(start, 240);
      return [
        { name: "Meal 1", timeLabel: `~${start}`, protFrac: 0.50, carbFrac: 0.50, fatFrac: 0.50 },
        { name: "Meal 2", timeLabel: `~${meal2}`, protFrac: 0.50, carbFrac: 0.50, fatFrac: 0.50 },
      ];
    }

    case "training-day-split": {
      // 35% of carbs front-loaded around workout: 20% pre-workout + 15% post-workout
      const wt = options?.workoutTime;
      return [
        {
          name: "Pre-workout",
          timeLabel: wt ? addMinutes(wt, -60) : undefined,
          protFrac: 0.20, carbFrac: 0.20, fatFrac: 0.15,
        },
        {
          name: "Post-workout",
          timeLabel: wt ? addMinutes(wt, 45) : undefined,
          protFrac: 0.30, carbFrac: 0.15, fatFrac: 0.15,
        },
        { name: "Breakfast", protFrac: 0.25, carbFrac: 0.35, fatFrac: 0.35 },
        { name: "Dinner",    protFrac: 0.25, carbFrac: 0.30, fatFrac: 0.35 },
      ];
      // protein: 0.20+0.30+0.25+0.25 = 1.00
      // carbs:   0.20+0.15+0.35+0.30 = 1.00 (35% to workout slots)
      // fat:     0.15+0.15+0.35+0.35 = 1.00
    }

    case "rest-day-split":
      // Slightly lower carbs / higher fat in the morning vs evening
      return [
        { name: "Breakfast", protFrac: 0.30, carbFrac: 0.28, fatFrac: 0.35 },
        { name: "Lunch",     protFrac: 0.35, carbFrac: 0.35, fatFrac: 0.33 },
        { name: "Dinner",    protFrac: 0.35, carbFrac: 0.37, fatFrac: 0.32 },
      ];
      // protein: 0.30+0.35+0.35 = 1.00
      // carbs:   0.28+0.35+0.37 = 1.00
      // fat:     0.35+0.33+0.32 = 1.00
  }
}

/**
 * Distributes daily macro targets across meal slots for the given structure.
 * Slot calories are derived from macros (protein/carbs × 4 kcal + fat × 9 kcal).
 * Integer rounding is applied per macro; the last slot absorbs any remainder so
 * totals always exactly match Math.round(dailyTarget.*).
 */
export function distributeMacrosToMeals(
  dailyTarget: MacroTarget,
  structure: MealStructure,
  dayType: DayType,
  options?: { workoutTime?: string; fastingWindowStart?: string }
): MealBreakdownPlan {
  const templates = getSlotTemplates(structure, options);

  const proteinDist = distributeValue(dailyTarget.proteinGrams, templates.map((t) => t.protFrac));
  const carbsDist   = distributeValue(dailyTarget.carbsGrams,   templates.map((t) => t.carbFrac));
  const fatDist     = distributeValue(dailyTarget.fatGrams,     templates.map((t) => t.fatFrac));

  const slots: MealSlot[] = templates.map((tpl, i) => {
    const proteinGrams = proteinDist[i];
    const carbsGrams   = carbsDist[i];
    const fatGrams     = fatDist[i];
    return {
      index: i,
      name: tpl.name,
      timeLabel: tpl.timeLabel,
      target: {
        calories:     Math.round(proteinGrams * 4 + carbsGrams * 4 + fatGrams * 9),
        proteinGrams,
        carbsGrams,
        fatGrams,
      },
    };
  });

  return { structure, dayType, dailyTarget, slots };
}
