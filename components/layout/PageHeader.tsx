import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

// Standard page header used across product pages.
// Provides a consistent pattern for:
// - title
// - supporting description
// - optional actions
// Every main route should use this component.
export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-xl)] border border-white/10 bg-white/5 p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
          Workspace
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-3">
          {actions}
        </div>
      ) : null}
    </section>
  );
}