import type { UserProfile } from "@shared/types/profile";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateProfilePayload(body: unknown): UserProfile | null {
  if (!isRecord(body)) return null;

  if (typeof body.name !== "string") return null;
  if (typeof body.coachSharingEnabled !== "boolean") return null;

  const sex =
    body.sex === "male" || body.sex === "female" ? body.sex : undefined;

  const validGoals = ["lose-weight", "gain-muscle", "body-recomp", "maintenance"];
  const goal =
    typeof body.goal === "string" && validGoals.includes(body.goal)
      ? (body.goal as UserProfile["goal"])
      : undefined;

  return {
    id: typeof body.id === "string" ? body.id : "",
    name: body.name,
    sex,
    age: typeof body.age === "number" ? body.age : undefined,
    heightCm: typeof body.heightCm === "number" ? body.heightCm : undefined,
    goal,
    coachSharingEnabled: body.coachSharingEnabled,
    coachName: typeof body.coachName === "string" ? body.coachName : undefined,
  };
}
