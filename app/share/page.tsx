import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import ShareOverview from "@/components/share/ShareOverview";

// Coach sharing page.
// This page summarizes what progress/data would be shared.
// Prioritize trust and clarity.
export default function SharePage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Share"
          description="Review the information prepared for sharing so the summary stays clear, readable, and easy to verify."
          actions={
            <Link
              href="/profile"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Back to profile
            </Link>
          }
        />

        <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Sharing summary
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Review the prepared coach view
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Check the summary below to make sure the shared view reflects your
            latest training, nutrition, and progress information clearly.
          </p>

          <div className="mt-6">
            <ShareOverview />
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}