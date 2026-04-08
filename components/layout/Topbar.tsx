"use client";

type TopbarProps = {
  onMenuToggle: () => void;
};

export default function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-200 bg-transparent px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-400 bg-slate-500 text-slate-900 shadow-sm transition hover:bg-slate-700 lg:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </svg>
        </button>

        <div>
          <p className="text-sm ">User Name</p>
          <h2 className="text-lg font-semibold ">Fitness Tracking</h2>
        </div>
      </div>

      <div className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium ">
        Abdel
      </div>
    </header>
  );
}
