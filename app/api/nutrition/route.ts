import { nutritionStore } from "@/lib/server/nutrition-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@/lib/server/api-response";
import type { NutritionResults } from "@/types/nutrition";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validateNutritionSummaryPayload(body: unknown): NutritionResults | null {
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
    if (typeof body[field] !== "number" || !Number.isFinite(body[field] as number)) {
      return null;
    }
  }

  return body as NutritionResults;
}

export async function GET() {
  try {
    const summary = await nutritionStore.getSummary();
    return apiSuccessResponse(summary);
  } catch (error) {
    console.error("Failed to load nutrition summary:", error);
    return apiErrorResponse({
      status: 500,
      message: "Failed to load nutrition summary.",
    });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const summary = validateNutritionSummaryPayload(body);

    if (!summary) {
      return apiErrorResponse({
        status: 400,
        message: "Valid nutrition summary payload is required.",
      });
    }

    const saved = await nutritionStore.saveSummary(summary);
    return apiSuccessResponse(saved);
  } catch (error) {
    console.error("Failed to save nutrition summary:", error);
    return apiErrorResponse({
      status: 500,
      message: "Failed to save nutrition summary.",
    });
  }
}
