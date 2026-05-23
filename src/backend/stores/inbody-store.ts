import { prisma } from "@backend/prisma/prisma";
import { createId } from "@shared/utils/create-id";
import type { InBodyEntry } from "@shared/types/progress";

function rowToEntry(row: {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
  skeletalMuscleMassKg: number | null;
  fatFreeMassKg: number | null;
  notes: string | null;
}): InBodyEntry {
  return {
    id: row.id,
    date: row.date,
    weightKg: row.weightKg,
    bodyFatPercent: row.bodyFatPercent,
    skeletalMuscleMassKg: row.skeletalMuscleMassKg ?? undefined,
    fatFreeMassKg: row.fatFreeMassKg ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export const inBodyStore = {
  async listEntries(userId: string): Promise<InBodyEntry[]> {
    const rows = await prisma.inBodyEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return rows.map(rowToEntry);
  },

  async addEntry(userId: string, data: Omit<InBodyEntry, "id">): Promise<InBodyEntry> {
    const row = await prisma.inBodyEntry.create({
      data: {
        id: createId("ibody"),
        userId,
        date: data.date,
        weightKg: data.weightKg,
        bodyFatPercent: data.bodyFatPercent,
        skeletalMuscleMassKg: data.skeletalMuscleMassKg ?? null,
        fatFreeMassKg: data.fatFreeMassKg ?? null,
        notes: data.notes ?? null,
      },
    });
    return rowToEntry(row);
  },

  async deleteEntry(userId: string, id: string): Promise<boolean> {
    const exists = await prisma.inBodyEntry.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!exists) return false;
    await prisma.inBodyEntry.delete({ where: { id } });
    return true;
  },
};
