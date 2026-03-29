export type NutritionInputs = {
  weightKg: number;
  bodyFatPercent: number;
};

export type NutritionResults = {
  fatFreeMassKg: number;
  fatFreeMassLbs: number;
  proteinFactor: number;
  proteinTargetGrams: number;
};