import { progressPhotoStore } from "@backend/stores/progress-photo-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { getAuthUserId } from "@backend/auth/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { id } = await context.params;
    const deleted = await progressPhotoStore.deleteEntry(userId, id);

    if (!deleted) return apiErrorResponse({ status: 404, message: "Progress photo not found." });

    return apiSuccessResponse({ deleted: true });
  } catch (error) {
    console.error("Failed to delete progress photo:", error);
    return apiErrorResponse({ status: 500, message: "Failed to delete progress photo." });
  }
}
