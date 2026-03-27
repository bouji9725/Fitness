import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";

export default function HomePage() {
  return (
    <AppShell>
      <PageHeader
        title="Isler Fit System"
        description="Track workouts, progressive overload, and client progress in one place."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Weekly Sessions" value="4" />
        <StatCard label="Active Clients" value="12" />
        <StatCard label="Tracked Workouts" value="36" />
      </div>
    </AppShell>
  );
}