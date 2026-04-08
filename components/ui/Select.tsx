import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
  selectSize?: "sm" | "md" | "lg";
};

export default function Select({
  className = "",
  hasError = false,
  selectSize = "md",
  disabled = false,
  ...props
}: SelectProps) {
  const sizeClasses = {
    sm: "min-h-9 text-sm",
    md: "min-h-11 text-sm",
    lg: "min-h-13 text-base",
  };

  const stateClasses = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-slate-200 focus:border-slate-400";

  const disabledClasses = disabled
    ? "cursor-not-allowed bg-slate-100 "
    : "bg-transparent ";

  return (
    <select
      disabled={disabled}
      className={`w-full rounded-xl border px-3 outline-none transition ${sizeClasses[selectSize]} ${stateClasses} ${disabledClasses} ${className}`}
      {...props}
    />
  );
}
