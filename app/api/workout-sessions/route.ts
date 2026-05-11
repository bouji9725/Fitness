import { workoutStore } from "@/lib/server/workout-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@/lib/server/api-response";
import { validateCreateWorkoutSessionPayload } from "@/lib/server/workout-validation";

// GET /api/workout-sessions
export async function GET() {
  return apiSuccessResponse(await workoutStore.listSavedSessions());
}

// POST /api/workout-sessions
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const validation = validateCreateWorkoutSessionPayload(body);

  if (!validation.ok) {
    return apiErrorResponse({
      status: 400,
      message: validation.message,
      details: validation.details,
    });
  }

  const session = await workoutStore.createSession(validation.data.templateId);

  if (!session) {
    return apiErrorResponse({
      status: 404,
      message: "Workout template not found.",
      details: {
        templateId: validation.data.templateId,
      },
    });
  }

  return apiSuccessResponse(session, 201);
}
