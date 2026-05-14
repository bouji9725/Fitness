import { profileStore } from "@/lib/server/profile-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@/lib/server/api-response";
import type { UserProfile } from "@/types/profile";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validateProfilePayload(body: unknown): UserProfile | null {
  if (!isRecord(body)) return null;

  if (typeof body.name !== "string") return null;
  if (typeof body.coachSharingEnabled !== "boolean") return null;

  return {
    id: typeof body.id === "string" ? body.id : "user-1",
    name: body.name,
    age: typeof body.age === "number" ? body.age : undefined,
    heightCm: typeof body.heightCm === "number" ? body.heightCm : undefined,
    goal:
      typeof body.goal === "string"
        ? (body.goal as UserProfile["goal"])
        : undefined,
    coachSharingEnabled: body.coachSharingEnabled,
    coachName: typeof body.coachName === "string" ? body.coachName : undefined,
  };
}

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
