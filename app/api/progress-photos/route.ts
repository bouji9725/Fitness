import { progressPhotoStore } from "@backend/stores/progress-photo-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { validateProgressPhotoPayload } from "@backend/validation/progress-validation";
import { getAuthUserId } from "@backend/auth/session";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const entries = await progressPhotoStore.listEntries(userId);
    return apiSuccessResponse(entries);
  } catch (error) {
    console.error("Failed to load progress photos:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load progress photos." });
  }
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const data = validateProgressPhotoPayload(body);

    if (!data) {
      return apiErrorResponse({ status: 400, message: "Valid photo payload is required." });
    }

    const entry = await progressPhotoStore.addEntry(userId, data);
    return apiSuccessResponse(entry, 201);
  } catch (error) {
    console.error("Failed to add progress photo:", error);
    return apiErrorResponse({ status: 500, message: "Failed to add progress photo." });
  }
}
