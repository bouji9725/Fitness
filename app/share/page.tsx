import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ShareOverview from "@/components/share/ShareOverview";

export default function SharePage() {
  return (
    <AppShell>
      <PageHeader
        title="Share with Coach Budi"
        description="Review and manage the progress data you want to share."
      />

      <ShareOverview />
    </AppShell>
  );
}