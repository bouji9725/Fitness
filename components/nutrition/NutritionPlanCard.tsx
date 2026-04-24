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

// Main calorie and macro output card.
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
  const macroRows = [
    {
      label: "Protein",
      grams: `${proteinTargetGrams} g`,
      calories: `${proteinCalories} kcal`,
    },
    {
      label: "Fat",
      grams: `${fatTargetGrams} g`,
      calories: `${fatCalories} kcal (${fatPercent}% of calories)`,
    },
    {
      label: "Carbs",
      grams: `${carbsTargetGrams} g`,
      calories: `${carbCalories} kcal`,
    },
  ];

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Plan
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Nutrition targets
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Daily calorie and macro targets based on your current goal.
        </p>
      </div>

      <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-4">
        <p className="text-sm text-indigo-200">Daily calories</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {calorieTarget} kcal
        </p>
      </div>

      <div className="space-y-3">
        {macroRows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-white">{row.label}</p>
              <p className="text-sm text-slate-300">{row.grams}</p>
            </div>

            <p className="mt-2 text-sm text-slate-400">{row.calories}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}