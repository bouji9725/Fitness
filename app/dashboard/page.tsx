import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

// Dashboard route.
// This page is the user's main overview screen.
// Focus on clarity, scanability, and next actions.
export default function DashboardPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Dashboard"
          description="Review your recent training activity, core metrics, and the current state of your workout history."
          actions={
            <Link
              href="/workouts"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 px-4 text-sm font-medium text-white transition hover:bg-indigo-500/25"
            >
              Go to workouts
            </Link>
          }
        />

        {/* Main dashboard content.
           Keep the route file thin and let the feature component own the dashboard details. */}
        <DashboardOverview />
      </PageContainer>
    </AppShell>
  );
}