import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  inputSize?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "min-h-9 text-sm",
  md: "min-h-11 text-sm",
  lg: "min-h-13 text-base",
};

// Shared input primitive.
// Keep visual states predictable across forms.
export default function Input({
  className = "",
  hasError = false,
  inputSize = "md",
  disabled = false,
  type = "text",
  ...props
}: InputProps) {
  const baseClasses =
    "w-full rounded-2xl border px-3 outline-none transition shadow-inner backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const stateClasses = hasError
    ? "border-red-400/40 bg-red-500/10 text-red-50 placeholder:text-red-200/50 focus:border-red-400"
    : "border-white/10 bg-slate-900/60 text-slate-100 placeholder:text-slate-400 focus:border-indigo-400/50";

  const disabledClasses = disabled
    ? "cursor-not-allowed opacity-60"
    : "";

  return (
    <input
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[inputSize]} ${stateClasses} ${disabledClasses} ${className}`}
      {...props}
    />
  );
}