"use client";

import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "Workouts" },
  { href: "/progress", label: "Progress" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/share", label: "Share" },
  
];

type SidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

function SidebarContent({ onClose }: Pick<SidebarProps, "onClose">) {
  return (
    <>
      <div className="mb-8 flex items-start bg-transparent justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold ">Fitsler Pro</h1>
          <p className="text-sm ">Tracking & Progress</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600 bg-transparent text-slate-300 shadow-sm transition hover:bg-slate-800 lg:hidden"
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
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav aria-label="Sidebar navigation">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block rounded-xl px-3 py-2  transition hover:bg-slate-800"
              >
                <h2>{link.label}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-transparent p-6 lg:block">
        <SidebarContent onClose={onClose} />
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" aria-hidden={!isMobileOpen}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-900/45"
          />

          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-slate-900 p-6 shadow-xl">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
