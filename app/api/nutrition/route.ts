import { nutritionStore } from "@backend/stores/nutrition-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { validateNutritionSummaryPayload } from "@backend/validation/nutrition-validation";

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
