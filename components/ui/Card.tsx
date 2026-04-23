import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

// Shared surface wrapper for panels and cards.
// Keep this component visually neutral and reusable across features.
export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`app-surface rounded-[var(--radius-xl)] p-5 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}