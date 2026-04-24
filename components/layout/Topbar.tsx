"use client";

import Link from "next/link";

type TopbarProps = {
  onMenuToggle: () => void;
};

// Lightweight top application bar.
// Keep this global and product-facing.
export default function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b app-hairline bg-slate-950/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10 lg:hidden"
            aria-label="Open navigation menu"
          >
            ☰
          </button>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-300">
              Training workspace
            </p>

            <p className="truncate text-sm text-slate-300">
              Workouts, progress, nutrition, and sharing in one place.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/workouts"
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 px-4 text-sm font-medium text-white transition hover:bg-indigo-500/25"
          >
            Start workout
          </Link>

          <Link
            href="/profile"
            className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}