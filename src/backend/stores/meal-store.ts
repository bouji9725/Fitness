import { prisma } from "@backend/prisma/prisma";
import type { MealLogEntry, MealPreference } from "@shared/types/nutrition";

function rowToPreference(row: {
  structure: string;
  dayType: string;
  workoutTime: string | null;
  fastingWindowStart: string | null;
}): MealPreference {
  return {
    structure: row.structure as MealPreference["structure"],
    dayType: row.dayType as MealPreference["dayType"],
    workoutTime: row.workoutTime ?? undefined,
    fastingWindowStart: row.fastingWindowStart ?? undefined,
  };
}

function rowToLogEntry(row: {
  id: string;
  date: string;
  slotIndex: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  notes: string | null;
}): MealLogEntry {
  return {
    id: row.id,
    date: row.date,
    slotIndex: row.slotIndex,
    calories: row.calories,
    proteinGrams: row.proteinGrams,
    carbsGrams: row.carbsGrams,
    fatGrams: row.fatGrams,
    notes: row.notes ?? undefined,
  };
}

export const mealStore = {
  async getPreference(userId: string): Promise<MealPreference | null> {
    const row = await prisma.mealPreference.findUnique({ where: { id: userId } });
    return row ? rowToPreference(row) : null;
  },

  async savePreference(userId: string, pref: MealPreference): Promise<MealPreference> {
    const data = {
      structure: pref.structure,
      dayType: pref.dayType,
      workoutTime: pref.workoutTime ?? null,
      fastingWindowStart: pref.fastingWindowStart ?? null,
    };

    await prisma.mealPreference.upsert({
      where: { id: userId },
      create: { id: userId, ...data },
      update: data,
    });

    return pref;
  },

  async getLogsForDate(userId: string, date: string): Promise<MealLogEntry[]> {
    const rows = await prisma.mealLogEntry.findMany({
      where: { userId, date },
      orderBy: { slotIndex: "asc" },
    });
    return rows.map(rowToLogEntry);
  },

  // Upserts by (userId, date, slotIndex) — one entry per slot per day.
  async saveLog(userId: string, payload: Omit<MealLogEntry, 'id'>): Promise<MealLogEntry> {
    const existing = await prisma.mealLogEntry.findFirst({
      where: { userId, date: payload.date, slotIndex: payload.slotIndex },
    });

    if (existing) {
      const updated = await prisma.mealLogEntry.update({
        where: { id: existing.id },
        data: {
          calories: payload.calories,
          proteinGrams: payload.proteinGrams,
          carbsGrams: payload.carbsGrams,
          fatGrams: payload.fatGrams,
          notes: payload.notes ?? null,
        },
      });
      return rowToLogEntry(updated);
    }

    const created = await prisma.mealLogEntry.create({
      data: {
        id: `log-${crypto.randomUUID()}`,
        userId,
        date: payload.date,
        slotIndex: payload.slotIndex,
        calories: payload.calories,
        proteinGrams: payload.proteinGrams,
        carbsGrams: payload.carbsGrams,
        fatGrams: payload.fatGrams,
        notes: payload.notes ?? null,
      },
    });

    return rowToLogEntry(created);
  },

  async deleteLog(userId: string, logId: string): Promise<boolean> {
    const exists = await prisma.mealLogEntry.findFirst({
      where: { id: logId, userId },
      select: { id: true },
    });

    if (!exists) return false;

    await prisma.mealLogEntry.delete({ where: { id: logId } });
    return true;
  },
};
