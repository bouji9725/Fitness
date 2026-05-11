import { workoutStore } from "@/lib/server/workout-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@/lib/server/api-response";
import { validateWorkoutSessionPayload } from "@/lib/server/workout-validation";

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

// GET /api/workout-sessions/:sessionId
export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const session = await workoutStore.getSession(sessionId);

  if (!session) {
    return apiErrorResponse({
      status: 404,
      message: "Workout session not found.",
      details: { sessionId },
    });
  }

  return apiSuccessResponse(session);
}

// PATCH /api/workout-sessions/:sessionId
export async function PATCH(request: Request, context: RouteContext) {
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
      details: {
        urlSessionId: sessionId,
        payloadSessionId: validation.data.id,
      },
    });
  }

  const savedRecord = await workoutStore.saveSession(sessionId, validation.data);

  if (!savedRecord) {
    return apiErrorResponse({
      status: 404,
      message: "Workout session not found.",
      details: { sessionId },
    });
  }

  return apiSuccessResponse(savedRecord);
}
