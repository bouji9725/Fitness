import type { ReactNode } from "react";

type ProfileInfoRowProps = {
  label: string;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
};

// Reusable information row for profile-style summary cards.
// Keep it compact and easy to scan.
export default function ProfileInfoRow({
  label,
  value,
  className = "",
  valueClassName = "",
}: ProfileInfoRowProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 ${className}`}
    >
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-medium text-white ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}