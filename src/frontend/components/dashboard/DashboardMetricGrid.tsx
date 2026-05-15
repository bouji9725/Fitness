import StatCard from "@frontend/components/ui/StatCard";
import type { NutritionResults } from "@shared/types/nutrition";
import type { BodyStatsEntry } from "@shared/types/progress";

type Props = {
  nutritionSummary: NutritionResults | null;
  latestBodyStats: BodyStatsEntry | null;
  savedWorkoutsCount: number;
  lastTrainingDay: string | null;
};

export default function DashboardMetricGrid({
  nutritionSummary,
  latestBodyStats,
  savedWorkoutsCount,
  lastTrainingDay,
}: Props) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Daily calorie target"
        value={nutritionSummary ? `${nutritionSummary.calorieTarget} kcal` : "—"}
        helperText={
          nutritionSummary
            ? `Protein ${nutritionSummary.proteinTargetGrams} g · Fat ${nutritionSummary.fatTargetGrams} g · Carbs ${nutritionSummary.carbsTargetGrams} g`
            : "Set up a nutrition plan to see your target."
        }
      />
      <StatCard
        label="Latest weight"
        value={latestBodyStats ? `${latestBodyStats.weightKg} kg` : "—"}
        helperText={
          latestBodyStats
            ? `Body fat: ${latestBodyStats.bodyFatPercent}%`
            : "Add a progress entry to track your weight."
        }
      />
      <StatCard
        label="Workouts saved"
        value={savedWorkoutsCount}
        helperText={
          lastTrainingDay
            ? `Last session: ${new Date(lastTrainingDay).toLocaleDateString()}`
            : "Save a workout session to start tracking."
        }
      />
    </section>
  );
}
