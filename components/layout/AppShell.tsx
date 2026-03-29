"use client";

import { useEffect, useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar onMenuToggle={() => setIsMobileSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}