import { workoutStore } from "@backend/stores/workout-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { getAuthUserId } from "@backend/auth/session";
import { validateUserTemplatePayload } from "@backend/validation/workout-validation";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const templates = await workoutStore.listUserTemplates(userId);
    return apiSuccessResponse(templates);
  } catch (error) {
    console.error("Failed to list user templates:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load templates." });
  }
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const validation = validateUserTemplatePayload(body);
    if (!validation.ok) {
      return apiErrorResponse({ status: 400, message: validation.message });
    }

    const template = await workoutStore.createUserTemplate(
      userId,
      validation.data.name,
      validation.data.exercises
    );
    return apiSuccessResponse(template, 201);
  } catch (error) {
    console.error("Failed to create user template:", error);
    return apiErrorResponse({ status: 500, message: "Failed to create template." });
  }
}
