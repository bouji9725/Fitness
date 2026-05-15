import { profileStore } from "@backend/stores/profile-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { validateProfilePayload } from "@backend/validation/profile-validation";
import { getAuthUserId } from "@backend/auth/session";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const profile = await profileStore.getProfile(userId);
    return apiSuccessResponse(profile);
  } catch (error) {
    console.error("Failed to load profile:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load profile." });
  }
}

export async function PUT(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const profile = validateProfilePayload(body);

    if (!profile) {
      return apiErrorResponse({ status: 400, message: "Invalid profile payload." });
    }

    const updated = await profileStore.saveProfile(userId, profile);
    return apiSuccessResponse(updated);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return apiErrorResponse({ status: 500, message: "Failed to update profile." });
  }
}
