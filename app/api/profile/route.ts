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
  if (typeof body.age !== "number") return null;
  if (typeof body.heightCm !== "number") return null;
  if (typeof body.goal !== "string") return null;
  if (typeof body.coachSharingEnabled !== "boolean") return null;

  return {
    id: typeof body.id === "string" ? body.id : "user-1",
    name: body.name,
    age: body.age,
    heightCm: body.heightCm,
    goal: body.goal as UserProfile["goal"],
    coachSharingEnabled: body.coachSharingEnabled,
    coachName: typeof body.coachName === "string" ? body.coachName : "",
  };
}

export async function GET() {
  return apiSuccessResponse(profileStore.getProfile());
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const profile = validateProfilePayload(body);

  if (!profile) {
    return apiErrorResponse({
      status: 400,
      message: "Valid profile payload is required.",
    });
  }

  return apiSuccessResponse(profileStore.saveProfile(profile));
}