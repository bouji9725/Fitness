import { nutritionStore } from "@backend/stores/nutrition-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { nutritionSummarySchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
import { getAuthUserId } from "@backend/auth/session";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const summary = await nutritionStore.getSummary(userId);
    return apiSuccessResponse(summary);
  } catch (error) {
    console.error("Failed to load nutrition summary:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load nutrition summary." });
  }
}

export async function PATCH(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const validation = validate(nutritionSummarySchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    const saved = await nutritionStore.saveSummary(userId, validation.data);
    return apiSuccessResponse(saved);
  } catch (error) {
    console.error("Failed to save nutrition summary:", error);
    return apiErrorResponse({ status: 500, message: "Failed to save nutrition summary." });
  }
}
