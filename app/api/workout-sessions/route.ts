import { workoutStore } from "@backend/stores/workout-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { validateCreateWorkoutSessionPayload } from "@backend/validation/workout-validation";
import { getAuthUserId } from "@backend/auth/session";

export async function GET(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  const { searchParams } = new URL(request.url);

  try {
    if (searchParams.get("active") === "true") {
      const sessions = await workoutStore.listActiveSessions(userId);
      return apiSuccessResponse(sessions);
    }

    const sessions = await workoutStore.listSavedSessions(userId);
    return apiSuccessResponse(sessions);
  } catch (error) {
    console.error("Failed to list workout sessions:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load workout sessions." });
  }
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const validation = validateCreateWorkoutSessionPayload(body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.message,
        details: validation.details,
      });
    }

    const session = await workoutStore.createSession(userId, validation.data.templateId);

    if (!session) {
      return apiErrorResponse({
        status: 404,
        message: "Workout template not found.",
        details: { templateId: validation.data.templateId },
      });
    }

    return apiSuccessResponse(session, 201);
  } catch (error) {
    console.error("Failed to create workout session:", error);
    return apiErrorResponse({ status: 500, message: "Failed to create workout session." });
  }
}
