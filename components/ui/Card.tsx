
import type { ReactNode } from "react";


type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white/200 p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}