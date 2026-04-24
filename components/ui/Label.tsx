import type { LabelHTMLAttributes, ReactNode } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
};

// Shared form label.
// Keep labels readable and consistent across all product forms.
export default function Label({
  children,
  className = "",
  ...props
}: LabelProps) {
  return (
    <label
      className={`text-sm font-medium text-slate-200 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}