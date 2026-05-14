import { workoutStore } from "@/lib/server/workout-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@/lib/server/api-response";
import { validateCreateWorkoutSessionPayload } from "@/lib/server/workout-validation";

export async function GET() {
  try {
    const sessions = await workoutStore.listSavedSessions();
    return apiSuccessResponse(sessions);
  } catch (error) {
    console.error("Failed to list workout sessions:", error);
    return apiErrorResponse({
      status: 500,
      message: "Failed to load workout sessions.",
    });
  }
}

export async function POST(request: Request) {
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

    const session = await workoutStore.createSession(validation.data.templateId);

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
    return apiErrorResponse({
      status: 500,
      message: "Failed to create workout session.",
    });
  }
}
