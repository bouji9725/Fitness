import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

// Home page for the fitness product.
// This is not a marketing landing page.
// It should orient the user quickly and guide them into the main workflows.
export default function HomePage() {
  const modules = [
    {
      title: "Dashboard",
      description:
        "See recent activity, track consistency, and understand where your training stands.",
      href: "/dashboard",
    },
    {
      title: "Workouts",
      description:
        "Open a workout template, log sets and reps, and build a repeatable training flow.",
      href: "/workouts",
    },
    {
      title: "Progress",
      description:
        "Record body stats over time and compare the latest check-in with previous entries.",
      href: "/progress",
    },
    {
      title: "Nutrition",
      description:
        "Calculate calories and macros in a simple, structured planning workflow.",
      href: "/nutrition",
    },
  ];

  const highlights = [
    "Workflow-first UI built around real product modules",
    "Clear route structure for workouts, progress, nutrition, and sharing",
    "Frontend foundation prepared for later backend and auth integration",
  ];

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          title="Fitsler"
          description="A focused fitness workspace for training sessions, progress tracking, nutrition planning, and coach-friendly summaries."
          actions={
            <Link
              href="/workouts"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 px-4 text-sm font-medium text-white transition hover:bg-indigo-500/25"
            >
              Start with workouts
            </Link>
          }
        />

        {/* Hero / product introduction */}
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="app-panel rounded-[var(--radius-xl)] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Product overview
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Build a clean training routine around one consistent workflow.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              This app is designed around the core tasks a fitness user actually
              repeats: choosing a workout, logging the session, reviewing recent
              training, tracking body progress, and planning nutrition without
              clutter.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Open dashboard
              </Link>

              <Link
                href="/progress"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Track progress
              </Link>
            </div>
          </div>

          {/* Product highlights */}
          <aside className="app-surface rounded-[var(--radius-xl)] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Why this app flow matters
            </p>

            <ul className="mt-4 space-y-4">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Main module grid */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <article
              key={module.title}
              className="app-surface rounded-[var(--radius-lg)] p-5 transition hover:border-indigo-400/30"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                Module
              </p>

              <h3 className="mt-3 text-xl font-semibold text-white">
                {module.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                {module.description}
              </p>

              <Link
                href={module.href}
                className="mt-5 inline-flex items-center text-sm font-medium text-indigo-200 transition hover:text-white"
              >
                Open {module.title}
              </Link>
            </article>
          ))}
        </section>
      </PageContainer>
    </AppShell>
  );
}