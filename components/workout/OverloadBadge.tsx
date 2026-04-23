type OverloadBadgeProps = {
  improved: boolean;
};

// Simple progress badge for quick signal inside an exercise card.
export default function OverloadBadge({ improved }: OverloadBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        improved
          ? "border border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
          : "border border-white/10 bg-white/5 text-slate-300",
      ].join(" ")}
    >
      {improved ? "Overload achieved" : "Match previous"}
    </span>
  );
}