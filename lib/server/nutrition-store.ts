import type { NutritionResults } from "@/types/nutrition";

declare global {
  // Temporary server-side nutrition store.
  // This will later be replaced by database persistence.
  // eslint-disable-next-line no-var
  var __fitnessNutritionStore: NutritionResults | null | undefined;
}

export const nutritionStore = {
  getSummary(): NutritionResults | null {
    return globalThis.__fitnessNutritionStore ?? null;
  },

  saveSummary(summary: NutritionResults): NutritionResults {
    globalThis.__fitnessNutritionStore = summary;
    return summary;
  },
};