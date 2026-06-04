import { mealStore } from "@backend/stores/meal-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { mealPreferenceSchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
import { getAuthUserId } from "@backend/auth/session";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const pref = await mealStore.getPreference(userId);
    return apiSuccessResponse(pref);
  } catch (error) {
    console.error("Failed to load meal preference:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load meal preference." });
  }
}

export async function PATCH(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const validation = validate(mealPreferenceSchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    const saved = await mealStore.savePreference(userId, validation.data);
    return apiSuccessResponse(saved);
  } catch (error) {
    console.error("Failed to save meal preference:", error);
    return apiErrorResponse({ status: 500, message: "Failed to save meal preference." });
  }
}
