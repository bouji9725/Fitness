import { progressStore } from "@backend/stores/progress-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { progressEntrySchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
import { getAuthUserId } from "@backend/auth/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const validation = validate(progressEntrySchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    const entry = await progressStore.updateEntry(userId, id, validation.data);
    if (!entry) return apiErrorResponse({ status: 404, message: "Progress entry not found." });

    return apiSuccessResponse(entry);
  } catch (error) {
    console.error("Failed to update progress entry:", error);
    return apiErrorResponse({ status: 500, message: "Failed to update progress entry." });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { id } = await context.params;
    const deleted = await progressStore.deleteEntry(userId, id);

    if (!deleted) return apiErrorResponse({ status: 404, message: "Progress entry not found." });

    return apiSuccessResponse({ deleted: true });
  } catch (error) {
    console.error("Failed to delete progress entry:", error);
    return apiErrorResponse({ status: 500, message: "Failed to delete progress entry." });
  }
}
