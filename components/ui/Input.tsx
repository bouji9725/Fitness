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

export default function Input({
  className = "",
  hasError = false,
  inputSize = "md",
  disabled = false,
  type = "text",
  ...props
}: InputProps) {
  const baseClasses =
    "w-full rounded-xl border px-3 outline-none transition shadow-inner backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  const stateClasses = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-white/10 focus:border-purple-400";

  const disabledClasses = disabled
    ? "cursor-not-allowed bg-slate-800/40 text-white/40"
    : "bg-slate-900/60 text-purple-200 placeholder:text-purple-300/40";

  return (
    <input
      type={type}
      disabled={disabled}
      className={[
        baseClasses,
        sizeClasses[inputSize],
        stateClasses,
        disabledClasses,
        className,
      ].join(" ")}
      {...props}
    />
  );
}