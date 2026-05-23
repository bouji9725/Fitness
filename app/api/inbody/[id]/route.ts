import { inBodyStore } from "@backend/stores/inbody-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { getAuthUserId } from "@backend/auth/session";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { id } = await context.params;
    const deleted = await inBodyStore.deleteEntry(userId, id);

    if (!deleted) return apiErrorResponse({ status: 404, message: "InBody entry not found." });

    return apiSuccessResponse({ deleted: true });
  } catch (error) {
    console.error("Failed to delete InBody entry:", error);
    return apiErrorResponse({ status: 500, message: "Failed to delete InBody entry." });
  }
}
