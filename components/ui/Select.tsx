import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
  selectSize?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "min-h-9 text-sm",
  md: "min-h-11 text-sm",
  lg: "min-h-13 text-base",
};

// Shared select primitive.
// Match the input styling so forms feel consistent.
export default function Select({
  className = "",
  hasError = false,
  selectSize = "md",
  disabled = false,
  children,
  ...props
}: SelectProps) {
  const stateClasses = hasError
    ? "border-red-400/40 bg-red-500/10 text-red-50 focus:border-red-400"
    : "border-white/10 bg-slate-900/60 text-slate-100 focus:border-indigo-400/50";

  const disabledClasses = disabled
    ? "cursor-not-allowed opacity-60"
    : "";

  return (
    <select
      disabled={disabled}
      className={`w-full rounded-2xl border px-3 outline-none transition ${sizeClasses[selectSize]} ${stateClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}