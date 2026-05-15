import Link from "next/link";
import AppShell from "@frontend/components/layout/AppShell";
import PageContainer from "@frontend/components/layout/PageContainer";
import PageHeader from "@frontend/components/layout/PageHeader";
import ShareOverview from "@frontend/components/share/ShareOverview";

export default function SharePage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Coach summary"
          title="Share"
          description="Check your report readiness, preview what gets shared, then export to clipboard, PDF, or JSON."
          actions={
            <Link
              href="/profile"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Manage sharing
            </Link>
          }
        />

        <ShareOverview />
      </PageContainer>
    </AppShell>
  );
}
