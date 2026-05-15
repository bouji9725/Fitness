import { workoutStore } from "@backend/stores/workout-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { validateWorkoutSessionPayload } from "@backend/validation/workout-validation";
import { getAuthUserId } from "@backend/auth/session";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { sessionId } = await context.params;
    const session = await workoutStore.getSession(userId, sessionId);

    if (!session) {
      return apiErrorResponse({
        status: 404,
        message: "Workout session not found.",
        details: { sessionId },
      });
    }

    return apiSuccessResponse(session);
  } catch (error) {
    console.error("Failed to load workout session:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load workout session." });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const { sessionId } = await context.params;
    const body = await request.json().catch(() => null);
    const validation = validateWorkoutSessionPayload(body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.message,
        details: validation.details,
      });
    }

    if (validation.data.id !== sessionId) {
      return apiErrorResponse({
        status: 400,
        message: "Session id in URL and payload must match.",
        details: { urlSessionId: sessionId, payloadSessionId: validation.data.id },
      });
    }

    const savedRecord = await workoutStore.saveSession(userId, sessionId, validation.data);

    if (!savedRecord) {
      return apiErrorResponse({
        status: 404,
        message: "Workout session not found.",
        details: { sessionId },
      });
    }

    return apiSuccessResponse(savedRecord);
  } catch (error) {
    console.error("Failed to save workout session:", error);
    return apiErrorResponse({ status: 500, message: "Failed to save workout session." });
  }
}
