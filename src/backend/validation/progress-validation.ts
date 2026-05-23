import type { BodyStatsEntry, InBodyEntry, ProgressPhotoEntry } from "@shared/types/progress";

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

export function validateProgressEntryUpdatePayload(
  body: unknown
): Omit<BodyStatsEntry, "id"> | null {
  if (!isRecord(body)) return null;
  if (typeof body.date !== "string") return null;
  if (typeof body.weightKg !== "number") return null;
  if (typeof body.bodyFatPercent !== "number") return null;

  return {
    date: body.date,
    weightKg: body.weightKg,
    bodyFatPercent: body.bodyFatPercent,
    muscleMassKg:
      typeof body.muscleMassKg === "number" ? body.muscleMassKg : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  };
}

export function validateInBodyEntryPayload(
  body: unknown
): Omit<InBodyEntry, "id"> | null {
  if (!isRecord(body)) return null;
  if (typeof body.date !== "string") return null;
  if (typeof body.weightKg !== "number") return null;
  if (typeof body.bodyFatPercent !== "number") return null;

  return {
    date: body.date,
    weightKg: body.weightKg,
    bodyFatPercent: body.bodyFatPercent,
    skeletalMuscleMassKg:
      typeof body.skeletalMuscleMassKg === "number" ? body.skeletalMuscleMassKg : undefined,
    fatFreeMassKg:
      typeof body.fatFreeMassKg === "number" ? body.fatFreeMassKg : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  };
}

export function validateProgressPhotoPayload(
  body: unknown
): Omit<ProgressPhotoEntry, "id"> | null {
  if (!isRecord(body)) return null;
  if (typeof body.date !== "string") return null;
  if (typeof body.imageUrl !== "string" || !body.imageUrl.trim()) return null;

  return {
    date: body.date,
    imageUrl: body.imageUrl.trim(),
    label: typeof body.label === "string" ? body.label.trim() || undefined : undefined,
  };
}
