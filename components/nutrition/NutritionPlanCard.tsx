import Card from "@/components/ui/Card";

type NutritionPlanCardProps = {
  calorieTarget: number;
  fatPercent: number;
  proteinTargetGrams: number;
  fatTargetGrams: number;
  carbsTargetGrams: number;
  proteinCalories: number;
  fatCalories: number;
  carbCalories: number;
};

export default function NutritionPlanCard({
  calorieTarget,
  fatPercent,
  proteinTargetGrams,
  fatTargetGrams,
  carbsTargetGrams,
  proteinCalories,
  fatCalories,
  carbCalories,
}: NutritionPlanCardProps) {
  return (
    <Card className="grid gap-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">
          Nutrition Plan Targets
        </h3>
        <p className="text-sm text-slate-500">
          Daily calories and macro breakdown
        </p>
      </div>

      <div className="rounded-2xl bg-blue-50 px-4 py-4">
        <p className="text-sm text-slate-600">Daily calorie target</p>
        <p className="text-3xl font-bold text-slate-900">
          {calorieTarget} kcal
        </p>
      </div>

      <div className="grid gap-3 text-sm text-slate-700">
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="font-medium text-slate-900">
            Protein: {proteinTargetGrams} g
          </p>
          <p>{proteinCalories} kcal</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <p className="font-medium text-slate-900">
            Fat: {fatTargetGrams} g
          </p>
          <p>
            {fatCalories} kcal ({fatPercent}% of calories)
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <p className="font-medium text-slate-900">
            Carbs: {carbsTargetGrams} g
          </p>
          <p>{carbCalories} kcal</p>
        </div>
      </div>
    </Card>
  );
}