import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import NutritionCalculator from "@/components/nutrition/NutritionCalculator";

// Nutrition planning page.
// Keep inputs, calculations, and results visually separated.
// The user should understand:
// - what they entered
// - what the result means
// - what target they should follow
export default function NutritionPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Nutrition"
          description="Estimate calories and macro targets in a simple planning flow that stays clear and practical."
          actions={
            <Link
              href="/profile"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Open profile
            </Link>
          }
        />

        <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Nutrition planner
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Build a calorie and macro target
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Use your current body data and goal to generate a nutrition target
            that stays easy to read and easy to adjust later.
          </p>

          <div className="mt-6">
            <NutritionCalculator />
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}