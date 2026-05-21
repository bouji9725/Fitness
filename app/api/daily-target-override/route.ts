import { dailyTargetOverrideStore } from "@backend/stores/daily-target-override-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { validateDailyTargetOverridePayload } from "@backend/validation/meal-validation";
import { getAuthUserId } from "@backend/auth/session";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !DATE_RE.test(date)) {
    return apiErrorResponse({ status: 400, message: "Query param ?date= must be a YYYY-MM-DD string." });
  }

  try {
    const override = await dailyTargetOverrideStore.getOverride(userId, date);
    return apiSuccessResponse(override);
  } catch (error) {
    console.error("Failed to load daily target override:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load daily target override." });
  }
}

export async function PATCH(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !DATE_RE.test(date)) {
    return apiErrorResponse({ status: 400, message: "Query param ?date= must be a YYYY-MM-DD string." });
  }

  try {
    const body = await request.json().catch(() => null);
    const validation = validateDailyTargetOverridePayload(body);

    if (!validation.ok) {
      return apiErrorResponse({ status: 400, message: validation.message, details: validation.details });
    }

    const saved = await dailyTargetOverrideStore.saveOverride(userId, date, validation.data);
    return apiSuccessResponse(saved);
  } catch (error) {
    console.error("Failed to save daily target override:", error);
    return apiErrorResponse({ status: 500, message: "Failed to save daily target override." });
  }
}

export async function DELETE(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !DATE_RE.test(date)) {
    return apiErrorResponse({ status: 400, message: "Query param ?date= must be a YYYY-MM-DD string." });
  }

  try {
    await dailyTargetOverrideStore.deleteOverride(userId, date);
    return apiSuccessResponse({ deleted: true });
  } catch (error) {
    console.error("Failed to delete daily target override:", error);
    return apiErrorResponse({ status: 500, message: "Failed to delete daily target override." });
  }
}
