import type { NutritionResults } from "@/types/nutrition";

const NUTRITION_SUMMARY_KEY = "fittrack:nutrition-summary";

export function saveNutritionSummary(summary: NutritionResults): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NUTRITION_SUMMARY_KEY, JSON.stringify(summary));
}

export function loadNutritionSummary(): NutritionResults | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(NUTRITION_SUMMARY_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as NutritionResults;
  } catch {
    return null;
  }
}