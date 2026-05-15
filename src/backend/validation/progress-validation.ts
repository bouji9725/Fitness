import type { BodyStatsEntry } from "@shared/types/progress";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function validateProgressEntryPayload(
  body: unknown
): BodyStatsEntry | null {
  if (!isRecord(body)) return null;

  if (typeof body.id !== "string") return null;
  if (typeof body.date !== "string") return null;
  if (typeof body.weightKg !== "number") return null;
  if (typeof body.bodyFatPercent !== "number") return null;

  return {
    id: body.id,
    date: body.date,
    weightKg: body.weightKg,
    bodyFatPercent: body.bodyFatPercent,
    muscleMassKg:
      typeof body.muscleMassKg === "number" ? body.muscleMassKg : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  };
}
