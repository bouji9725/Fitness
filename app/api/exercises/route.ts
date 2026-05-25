import { filterExercises } from "@backend/data/exercises";
import { apiSuccessResponse } from "@backend/responses/api-response";
import { getAuthUserId } from "@backend/auth/session";
import { apiErrorResponse } from "@backend/responses/api-response";

export async function GET(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const muscleGroup = searchParams.get("muscleGroup") ?? "";

  return apiSuccessResponse(filterExercises(search, muscleGroup));
}
