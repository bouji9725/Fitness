import { prisma } from "@backend/prisma/prisma";
import type { NutritionResults } from "@shared/types/nutrition";

const SINGLETON_ID = "singleton";

export const nutritionStore = {
  async getSummary(): Promise<NutritionResults | null> {
    const row = await prisma.nutritionSummary.findUnique({
      where: { id: SINGLETON_ID },
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

  async saveSummary(summary: NutritionResults): Promise<NutritionResults> {
    await prisma.nutritionSummary.upsert({
      where: { id: SINGLETON_ID },
      create: { id: SINGLETON_ID, ...summary },
      update: { ...summary },
    });

    return summary;
  },
};
