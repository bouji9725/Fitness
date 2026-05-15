import { prisma } from "@backend/prisma/prisma";
import type { BodyStatsEntry } from "@shared/types/progress";

function rowToEntry(row: {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
  muscleMassKg: number | null;
  notes: string | null;
}): BodyStatsEntry {
  return {
    id: row.id,
    date: row.date,
    weightKg: row.weightKg,
    bodyFatPercent: row.bodyFatPercent,
    muscleMassKg: row.muscleMassKg ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export const progressStore = {
  async listEntries(userId: string): Promise<BodyStatsEntry[]> {
    const rows = await prisma.bodyStatsEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return rows.map(rowToEntry);
  },

  async addEntry(userId: string, entry: BodyStatsEntry): Promise<BodyStatsEntry[]> {
    await prisma.bodyStatsEntry.create({
      data: {
        id: entry.id,
        userId,
        date: entry.date,
        weightKg: entry.weightKg,
        bodyFatPercent: entry.bodyFatPercent,
        muscleMassKg: entry.muscleMassKg ?? null,
        notes: entry.notes ?? null,
      },
    });

    return this.listEntries(userId);
  },
};
