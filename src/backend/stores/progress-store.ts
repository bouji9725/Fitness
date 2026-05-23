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

  async updateEntry(
    userId: string,
    id: string,
    data: Omit<BodyStatsEntry, "id">
  ): Promise<BodyStatsEntry | null> {
    const exists = await prisma.bodyStatsEntry.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!exists) return null;

    const row = await prisma.bodyStatsEntry.update({
      where: { id },
      data: {
        date: data.date,
        weightKg: data.weightKg,
        bodyFatPercent: data.bodyFatPercent,
        muscleMassKg: data.muscleMassKg ?? null,
        notes: data.notes ?? null,
      },
    });
    return rowToEntry(row);
  },

  async deleteEntry(userId: string, id: string): Promise<boolean> {
    const exists = await prisma.bodyStatsEntry.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!exists) return false;
    await prisma.bodyStatsEntry.delete({ where: { id } });
    return true;
  },
};
