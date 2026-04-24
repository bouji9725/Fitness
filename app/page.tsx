import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

export default function HomePage() {
  const modules = [
    {
      title: "Dashboard",
      description:
        "Review saved workouts, training volume, completed sets, and recent activity.",
      href: "/dashboard",
    },
    {
      title: "Workouts",
      description:
        "Choose a workout template, log sets, track volume, and save your session.",
      href: "/workouts",
    },
    {
      title: "Progress",
      description:
        "Track body stats over time and compare your latest check-in with previous entries.",
      href: "/progress",
    },
    {
      title: "Nutrition",
      description:
        "Calculate calorie and macro targets based on your current body data and goal.",
      href: "/nutrition",
    },
  ];

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Fitness tracker"
          title="Train with structure. Track with clarity."
          description="Fitsler helps you organize workouts, monitor progress, calculate nutrition targets, and prepare clear summaries for coaching or personal review."
          actions={
            <Link
              href="/workouts"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 px-4 text-sm font-medium text-white transition hover:bg-indigo-500/25"
            >
              Start workout
            </Link>
          }
        />

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="app-panel rounded-[var(--radius-xl)] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Core workflow
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Everything starts with a logged workout.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Pick a training template, record your sets, save the session, and
              let the dashboard, progress, nutrition, and sharing views build on
              that data.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                View dashboard
              </Link>

              <Link
                href="/nutrition"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Plan nutrition
              </Link>
            </div>
          </div>

          <aside className="app-surface rounded-[var(--radius-xl)] p-6 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Product focus
            </p>

            <div className="mt-5 space-y-4">
              {[
                "Workout logging with saved session history",
                "Dashboard metrics based on completed training data",
                "Progress and nutrition views connected to user inputs",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </section>

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