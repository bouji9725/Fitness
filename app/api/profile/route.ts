import { profileStore } from "@backend/stores/profile-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { profileUpdateSchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
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

export async function PATCH(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const validation = validate(profileUpdateSchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    const updated = await profileStore.saveProfile(userId, {
      id: userId,
      ...validation.data,
    });
    return apiSuccessResponse(updated);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return apiErrorResponse({ status: 500, message: "Failed to update profile." });
  }
}
