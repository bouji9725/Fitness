"use client";

import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AppShellProps = {
  children: ReactNode;
};

// Shared application shell used by all product pages.
// This component owns the structural layout:
// - sidebar
// - topbar
// - main content region
// It should not contain page-specific content or business logic.
export default function AppShell({ children }: AppShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Lock body scroll while the mobile sidebar is open.
  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="relative min-h-screen">
      {/* Soft global background accents for the shell. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[-10%] top-[-12%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-8%] h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <Sidebar isMobileOpen={false} onClose={() => setIsMobileSidebarOpen(false)} />

        {/* Mobile sidebar / overlay */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main app column */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-72">
          <Topbar onMenuToggle={() => setIsMobileSidebarOpen(true)} />

          {/* Main content region.
             Keep route-specific content inside PageContainer, not here. */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}