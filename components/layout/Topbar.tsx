"use client";

type TopbarProps = {
  onMenuToggle: () => void;
};

// Lightweight top application bar.
// Use this for global actions and shell controls only.
// Do not place page-specific titles or route-specific business logic here.
export default function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b app-hairline bg-slate-950/55 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile navigation trigger */}
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
              Product Workspace
            </p>
            <p className="truncate text-sm text-slate-300">
              Fitness tracking with a clean workflow-first UI
            </p>
          </div>
        </div>

        {/* Right-side shell meta area.
           Keep this generic until real auth/user data exists. */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-medium text-indigo-200">
            Frontend phase
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
            Solo build
          </div>
        </div>
      </div>
    </header>
  );
}