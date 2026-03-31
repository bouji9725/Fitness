import type {
  NutritionInputs,
  NutritionResults,
} from "@/types/nutrition";

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

  return tdee;
}

export function getFatPercent(inputs: NutritionInputs): number {
  const { goal, recompDirection } = inputs;

  if (goal === "lose-weight") return 0.2;
  if (goal === "gain-muscle") return 0.3;

  if (goal === "body-recomp") {
    return recompDirection === "slight-deficit" ? 0.2 : 0.25;
  }

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