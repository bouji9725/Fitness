import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import NutritionCalculator from "@/components/nutrition/NutritionCalculator";

export default function NutritionPage() {
  return (
    <AppShell>
      <PageHeader
        title="Nutrition"
        description="Track body composition and estimate daily protein needs."
      />

      <NutritionCalculator />
    </AppShell>
  );
}