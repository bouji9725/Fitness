import type { NutritionResults } from "@shared/types/nutrition";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateNutritionSummaryPayload(
  body: unknown
): NutritionResults | null {
  if (!isRecord(body)) return null;

  const requiredNumberFields = [
    "fatFreeMassKg",
    "fatFreeMassLbs",
    "proteinFactor",
    "proteinTargetGrams",
    "proteinCalories",
    "calorieTarget",
    "fatPercent",
    "fatCalories",
    "fatTargetGrams",
    "carbCalories",
    "carbsTargetGrams",
  ];

  for (const field of requiredNumberFields) {
    if (
      typeof body[field] !== "number" ||
      !Number.isFinite(body[field] as number)
    ) {
      return null;
    }
  }

  return body as NutritionResults;
}
