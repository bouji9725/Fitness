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
        <h3 className="text-xl font-semibold ">Nutrition Summary</h3>
        <p className="text-sm ">
          Latest calorie and macro recommendations
        </p>
      </div>

      {!nutrition ? (
        <p className="text-sm ">
          No nutrition data to share yet.
        </p>
      ) : (
        <div className="grid gap-2 text-sm ">
          <p>
            Calories:{" "}
            <span className="font-medium ">
              {nutrition.calorieTarget} kcal
            </span>
          </p>
          <p>
            Protein:{" "}
            <span className="font-medium ">
              {nutrition.proteinTargetGrams} g
            </span>
          </p>
          <p>
            Fat:{" "}
            <span className="font-medium ">
              {nutrition.fatTargetGrams} g
            </span>
          </p>
          <p>
            Carbs:{" "}
            <span className="font-medium ">
              {nutrition.carbsTargetGrams} g
            </span>
          </p>
        </div>
      )}
    </Card>
  );
}
