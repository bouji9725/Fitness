import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-400 ${className}`}
      {...props}
    />
  );
}