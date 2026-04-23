"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workouts", label: "Workouts" },
  { href: "/progress", label: "Progress" },
  { href: "/nutrition", label: "Nutrition" },
  { href: "/profile", label: "Profile" },
  { href: "/share", label: "Share" },
];

type SidebarProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

type SidebarContentProps = {
  onClose: () => void;
};

// Primary product navigation.
// Keep links, labels, and active-state logic centralized here.
// This file should define navigation structure, not page content.
function SidebarContent({ onClose }: SidebarContentProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Product branding area */}
      <div className="border-b app-hairline px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
          Fitness SaaS
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">Fitsler</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Training, progress, and nutrition in one focused workspace.
        </p>
      </div>

      {/* Main navigation list */}
      <nav aria-label="Primary navigation" className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={[
                    "flex items-center rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-indigo-500/15 text-white ring-1 ring-inset ring-indigo-400/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom helper area */}
      <div className="border-t app-hairline px-5 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Current focus
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Build a clear, repeatable training workflow before adding backend complexity.
        </p>
      </div>
    </div>
  );
}

export default function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="app-panel fixed inset-y-0 left-0 z-30 hidden w-72 border-r lg:block">
        <SidebarContent onClose={onClose} />
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/70"
            onClick={onClose}
          />

          <aside className="app-panel absolute inset-y-0 left-0 w-[88vw] max-w-72 border-r">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      ) : null}
    </>
  );
}