import { progressStore } from "@backend/stores/progress-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { validateProgressEntryUpdatePayload } from "@backend/validation/progress-validation";
import { getAuthUserId } from "@backend/auth/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const data = validateProgressEntryUpdatePayload(body);

    if (!data) {
      return apiErrorResponse({ status: 400, message: "Valid progress entry payload is required." });
    }

    const entry = await progressStore.updateEntry(userId, id, data);
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
