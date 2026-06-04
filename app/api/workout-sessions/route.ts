import { workoutStore } from "@backend/stores/workout-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { createSessionSchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
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

    const date = searchParams.get("date");
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return apiErrorResponse({ status: 400, message: "Query param ?date= must be a YYYY-MM-DD string." });
      }
      const hasSession = await workoutStore.hasSessionForDate(userId, date);
      return apiSuccessResponse({ hasSession });
    }

    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10)) : undefined;
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10)) : 0;

    const page = await workoutStore.listSavedSessions(userId, { limit, offset });
    return apiSuccessResponse(page);
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
    const validation = validate(createSessionSchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    let session;
    if ("name" in validation.data) {
      session = await workoutStore.createCustomSession(userId, validation.data.name);
    } else {
      session = await workoutStore.createSession(userId, validation.data.templateId);
      if (!session) {
        return apiErrorResponse({
          status: 404,
          message: "Workout template not found.",
          details: { templateId: validation.data.templateId },
        });
      }
    }

    return apiSuccessResponse(session, 201);
  } catch (error) {
    console.error("Failed to create workout session:", error);
    return apiErrorResponse({ status: 500, message: "Failed to create workout session." });
  }
}
