import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import ShareOverview from "@/components/share/ShareOverview";

export default function SharePage() {
  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Coach summary"
          title="Share"
          description="Review the profile, progress, nutrition, and workout data prepared for a clear coach-facing summary."
          actions={
            <Link
              href="/profile"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Manage sharing
            </Link>
          }
        />

        <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Review
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Coach-ready summary
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            This view combines your latest profile, progress, nutrition, and
            workout information into one structured summary.
          </p>

          <div className="mt-6">
            <ShareOverview />
          </div>
        </section>
      </PageContainer>
    </AppShell>
  );
}