import Card from "@/components/ui/Card";
import type { NutritionResults } from "@/types/nutrition";

type ShareNutritionSummaryProps = {
  nutrition: NutritionResults | null;
};

export default function ShareNutritionSummary({
  nutrition,
}: ShareNutritionSummaryProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">
          Nutrition Shared
        </h3>
        <p className="text-sm text-slate-500">
          Latest calorie and macro recommendations
        </p>
      </div>

      {!nutrition ? (
        <p className="text-sm text-slate-500">
          No nutrition data to share yet.
        </p>
      ) : (
        <div className="space-y-2 text-sm text-slate-600">
          <p>Calories: {nutrition.calorieTarget} kcal</p>
          <p>Protein: {nutrition.proteinTargetGrams} g</p>
          <p>Fat: {nutrition.fatTargetGrams} g</p>
          <p>Carbs: {nutrition.carbsTargetGrams} g</p>
        </div>
      )}
    </Card>
  );
}