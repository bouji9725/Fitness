import { mealStore } from "@backend/stores/meal-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { mealLogEntrySchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
import { getAuthUserId } from "@backend/auth/session";

export async function GET(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return apiErrorResponse({
      status: 400,
      message: "Query param ?date= must be a YYYY-MM-DD string.",
    });
  }

  try {
    const logs = await mealStore.getLogsForDate(userId, date);
    return apiSuccessResponse(logs);
  } catch (error) {
    console.error("Failed to load meal logs:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load meal logs." });
  }
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const validation = validate(mealLogEntrySchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    const entry = await mealStore.saveLog(userId, validation.data);
    return apiSuccessResponse(entry, 201);
  } catch (error) {
    console.error("Failed to save meal log:", error);
    return apiErrorResponse({ status: 500, message: "Failed to save meal log." });
  }
}
