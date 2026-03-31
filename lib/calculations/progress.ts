import type { BodyStatsEntry } from "@/types/progress";

export function getLatestBodyStats(entries: BodyStatsEntry[]): BodyStatsEntry | null {
  if (entries.length === 0) return null;

  return [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}

export function getPreviousBodyStats(entries: BodyStatsEntry[]): BodyStatsEntry | null {
  if (entries.length < 2) return null;

  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return sorted[1];
}

export function calculateBodyStatsDifference(
  current: BodyStatsEntry | null,
  previous: BodyStatsEntry | null
) {
  if (!current || !previous) {
    return null;
  }

  return {
    weightDiff: Number((current.weightKg - previous.weightKg).toFixed(1)),
    bodyFatDiff: Number(
      (current.bodyFatPercent - previous.bodyFatPercent).toFixed(1)
    ),
    muscleMassDiff:
      current.muscleMassKg != null && previous.muscleMassKg != null
        ? Number((current.muscleMassKg - previous.muscleMassKg).toFixed(1))
        : null,
  };
}