import type { UserProfile } from "@shared/types/profile";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateProfilePayload(body: unknown): UserProfile | null {
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
