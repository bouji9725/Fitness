import { prisma } from "@backend/prisma/prisma";
import type { NutritionResults } from "@shared/types/nutrition";

export const nutritionStore = {
  async getSummary(userId: string): Promise<NutritionResults | null> {
    const row = await prisma.nutritionSummary.findUnique({
      where: { id: userId },
    });

    if (!row) return null;

    return {
      fatFreeMassKg: row.fatFreeMassKg,
      fatFreeMassLbs: row.fatFreeMassLbs,
      proteinFactor: row.proteinFactor,
      proteinTargetGrams: row.proteinTargetGrams,
      calorieTarget: row.calorieTarget,
      fatPercent: row.fatPercent,
      fatTargetGrams: row.fatTargetGrams,
      carbsTargetGrams: row.carbsTargetGrams,
      proteinCalories: row.proteinCalories,
      fatCalories: row.fatCalories,
      carbCalories: row.carbCalories,
    };
  },

  async saveSummary(userId: string, summary: NutritionResults): Promise<NutritionResults> {
    await prisma.nutritionSummary.upsert({
      where: { id: userId },
      create: { id: userId, ...summary },
      update: { ...summary },
    });

    return summary;
  },
};
