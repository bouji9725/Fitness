// Centralized theme values for reusable UI decisions.
// Keep this lightweight. This is not meant to replace Tailwind.
// It is meant to standardize the most repeated visual tokens.

export const theme = {
  brand: {
    primary: "text-indigo-300",
    primarySurface:
      "border-indigo-400/20 bg-indigo-500/10",
    successSurface:
      "border-emerald-400/25 bg-emerald-500/10",
    warningSurface:
      "border-amber-400/25 bg-amber-500/10",
    dangerSurface:
      "border-red-400/25 bg-red-500/10",
  },
  surface: {
    card: "app-surface rounded-[var(--radius-xl)]",
    panel: "app-panel rounded-[var(--radius-xl)]",
    soft: "rounded-2xl border border-white/10 bg-white/5",
  },
  text: {
    muted: "text-slate-400",
    secondary: "text-slate-300",
    strong: "text-white",
  },
};