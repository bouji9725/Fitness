import Link from "next/link";
import AppShell from "@frontend/components/layout/AppShell";
import PageContainer from "@frontend/components/layout/PageContainer";
import PageHeader from "@frontend/components/layout/PageHeader";
import NutritionCalculator from "@frontend/components/nutrition/NutritionCalculator";

export default function NutritionPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Nutrition planning"
          title="Nutrition"
          description="Follow three steps: enter your body data, choose your goal and activity level, then review your calorie and macro targets."
          actions={
            <Link
              href="/profile"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View profile
            </Link>
          }
        />

        <NutritionCalculator />
      </PageContainer>
    </AppShell>
  );
}
