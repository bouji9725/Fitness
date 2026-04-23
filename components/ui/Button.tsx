import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

// Shared button primitive.
// Use variants for intent, not random one-off class strings.
export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium transition focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

  const variantClasses = {
    primary:
      "border border-indigo-400/30 bg-indigo-500/15 text-white hover:bg-indigo-500/25",
    secondary:
      "border border-white/10 bg-white/5 text-white hover:bg-white/10",
    ghost:
      "border border-transparent bg-transparent text-slate-200 hover:bg-white/5",
    danger:
      "border border-red-400/30 bg-red-500/15 text-red-50 hover:bg-red-500/25",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}