import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Quick overview of training performance and client activity."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Completed Workouts" value="18" />
        <StatCard label="Progressive Overloads" value="9" />
        <StatCard label="Active Clients" value="12" />
        <StatCard label="Avg. Adherence" value="87%" />
      </div>
    </AppShell>
  );
}