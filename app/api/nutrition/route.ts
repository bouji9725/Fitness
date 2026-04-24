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
    if (typeof body[field] !== "number" || !Number.isFinite(body[field])) {
      return null;
    }
  }

  return body as NutritionResults;
}

// GET /api/nutrition
// Returns the latest saved nutrition summary.
export async function GET() {
  return apiSuccessResponse(nutritionStore.getSummary());
}

// PUT /api/nutrition
// Saves the latest nutrition summary.
export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const summary = validateNutritionSummaryPayload(body);

  if (!summary) {
    return apiErrorResponse({
      status: 400,
      message: "Valid nutrition summary payload is required.",
    });
  }

  return apiSuccessResponse(nutritionStore.saveSummary(summary));
}