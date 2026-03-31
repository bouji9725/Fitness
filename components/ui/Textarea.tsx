import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none transition focus:border-slate-400 ${className}`}
      {...props}
    />
  );
}