import Card from "@/components/ui/Card";
import type { NutritionResults } from "@/types/nutrition";

type ShareNutritionSummaryProps = {
  nutrition: NutritionResults | null;
};

export default function ShareNutritionSummary({
  nutrition,
}: ShareNutritionSummaryProps) {
  return (
    <Card className="grid gap-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Nutrition Summary</h3>
        <p className="text-sm text-slate-500">
          Latest calorie and macro recommendations
        </p>
      </div>

      {!nutrition ? (
        <p className="text-sm text-slate-500">
          No nutrition data to share yet.
        </p>
      ) : (
        <div className="grid gap-2 text-sm text-slate-600">
          <p>
            Calories:{" "}
            <span className="font-medium text-slate-900">
              {nutrition.calorieTarget} kcal
            </span>
          </p>
          <p>
            Protein:{" "}
            <span className="font-medium text-slate-900">
              {nutrition.proteinTargetGrams} g
            </span>
          </p>
          <p>
            Fat:{" "}
            <span className="font-medium text-slate-900">
              {nutrition.fatTargetGrams} g
            </span>
          </p>
          <p>
            Carbs:{" "}
            <span className="font-medium text-slate-900">
              {nutrition.carbsTargetGrams} g
            </span>
          </p>
        </div>
      )}
    </Card>
  );
}