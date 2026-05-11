import { prisma } from "./prisma";
import type { BodyStatsEntry } from "@/types/progress";

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
  async listEntries(): Promise<BodyStatsEntry[]> {
    const rows = await prisma.bodyStatsEntry.findMany({
      orderBy: { date: "desc" },
    });

    return rows.map(rowToEntry);
  },

  async addEntry(entry: BodyStatsEntry): Promise<BodyStatsEntry[]> {
    await prisma.bodyStatsEntry.create({
      data: {
        id: entry.id,
        date: entry.date,
        weightKg: entry.weightKg,
        bodyFatPercent: entry.bodyFatPercent,
        muscleMassKg: entry.muscleMassKg ?? null,
        notes: entry.notes ?? null,
      },
    });

    return this.listEntries();
  },
};
