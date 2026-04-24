import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import NutritionCalculator from "@/components/nutrition/NutritionCalculator";

export default function NutritionPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Nutrition planning"
          title="Nutrition"
          description="Estimate calories, protein, fats, and carbs from your current body data and fitness goal."
          actions={
            <Link
              href="/profile"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View profile
            </Link>
          }
        />

        <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Calculator
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Build your nutrition target
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Adjust your inputs, choose a goal, and review a clear macro plan
            that can be used across the rest of the app.
          </p>

          <div className="mt-6">
            <NutritionCalculator />
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}