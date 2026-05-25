import { workoutStore } from "@backend/stores/workout-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { getAuthUserId } from "@backend/auth/session";
import { validateUserTemplatePayload } from "@backend/validation/workout-validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const validation = validateUserTemplatePayload(body);
    if (!validation.ok) {
      return apiErrorResponse({ status: 400, message: validation.message });
    }

    const updated = await workoutStore.updateUserTemplate(
      userId,
      id,
      validation.data.name,
      validation.data.exercises
    );
    if (!updated) return apiErrorResponse({ status: 404, message: "Template not found." });

    return apiSuccessResponse(updated);
  } catch (error) {
    console.error("Failed to update user template:", error);
    return apiErrorResponse({ status: 500, message: "Failed to update template." });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { id } = await context.params;
    const deleted = await workoutStore.deleteUserTemplate(userId, id);
    if (!deleted) return apiErrorResponse({ status: 404, message: "Template not found." });

    return apiSuccessResponse({ deleted: true });
  } catch (error) {
    console.error("Failed to delete user template:", error);
    return apiErrorResponse({ status: 500, message: "Failed to delete template." });
  }
}
