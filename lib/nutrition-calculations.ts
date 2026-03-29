import type { NutritionInputs, NutritionResults } from "@/types/nutrition";

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

  return {
    fatFreeMassKg: roundToOneDecimal(fatFreeMassKg),
    fatFreeMassLbs: roundToOneDecimal(fatFreeMassLbs),
    proteinFactor: roundToOneDecimal(proteinFactor),
    proteinTargetGrams: roundToOneDecimal(proteinTargetGrams),
  };
}