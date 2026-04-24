import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Training overview"
          title="Dashboard"
          description="Review saved sessions, training volume, completed sets, and recent workout activity from one clear overview."
          actions={
            <Link
              href="/workouts"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 px-4 text-sm font-medium text-white transition hover:bg-indigo-500/25"
            >
              Log workout
            </Link>
          }
        />

        <DashboardOverview />
      </PageContainer>
    </AppShell>
  );
}