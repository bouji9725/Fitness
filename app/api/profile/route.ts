import { profileStore } from "@backend/stores/profile-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { validateProfilePayload } from "@backend/validation/profile-validation";

export async function GET() {
  try {
    const profile = await profileStore.getProfile();
    return apiSuccessResponse(profile);
  } catch (error) {
    console.error("Failed to load profile:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load profile." });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const profile = validateProfilePayload(body);

    if (!profile) {
      return apiErrorResponse({
        status: 400,
        message: "Invalid profile payload.",
      });
    }

    const updated = await profileStore.saveProfile(profile);
    return apiSuccessResponse(updated);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return apiErrorResponse({
      status: 500,
      message: "Failed to update profile.",
    });
  }
}
