import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Overview of saved workout sessions, training volume, and recent activity."
      />

      <DashboardOverview />
    </AppShell>
  );
}