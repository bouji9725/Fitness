import { prisma } from "@backend/prisma/prisma";
import { createId } from "@shared/utils/create-id";
import type { DailyTargetOverride } from "@shared/types/nutrition";

function rowToOverride(row: {
  date: string;
  calories: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;
}): DailyTargetOverride {
  return {
    date: row.date,
    calories: row.calories ?? undefined,
    proteinGrams: row.proteinGrams ?? undefined,
    carbsGrams: row.carbsGrams ?? undefined,
    fatGrams: row.fatGrams ?? undefined,
  };
}

export const dailyTargetOverrideStore = {
  async getOverride(userId: string, date: string): Promise<DailyTargetOverride | null> {
    const row = await prisma.dailyTargetOverride.findUnique({
      where: { userId_date: { userId, date } },
    });
    return row ? rowToOverride(row) : null;
  },

  async saveOverride(
    userId: string,
    date: string,
    data: Omit<DailyTargetOverride, "date">
  ): Promise<DailyTargetOverride> {
    const row = await prisma.dailyTargetOverride.upsert({
      where: { userId_date: { userId, date } },
      create: {
        id: createId("dto"),
        userId,
        date,
        calories: data.calories ?? null,
        proteinGrams: data.proteinGrams ?? null,
        carbsGrams: data.carbsGrams ?? null,
        fatGrams: data.fatGrams ?? null,
      },
      update: {
        calories: data.calories ?? null,
        proteinGrams: data.proteinGrams ?? null,
        carbsGrams: data.carbsGrams ?? null,
        fatGrams: data.fatGrams ?? null,
      },
    });
    return rowToOverride(row);
  },

  async deleteOverride(userId: string, date: string): Promise<boolean> {
    const exists = await prisma.dailyTargetOverride.findUnique({
      where: { userId_date: { userId, date } },
      select: { id: true },
    });
    if (!exists) return false;
    await prisma.dailyTargetOverride.delete({
      where: { userId_date: { userId, date } },
    });
    return true;
  },
};
