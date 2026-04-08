import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export default function Textarea({
  className = "",
  hasError = false,
  disabled = false,
  ...props
}: TextareaProps) {
  const stateClasses = hasError
    ? "border-red-500 focus:border-red-500"
    : "border-slate-200 focus:border-slate-400";

  const disabledClasses = disabled
    ? "cursor-not-allowed bg-slate-800 "
    : "bg-transparent ";

  return (
    <textarea
      disabled={disabled}
      className={`w-full min-h-24 rounded-xl border px-3 py-3 outline-none transition ${stateClasses} ${disabledClasses} ${className}`}
      {...props}
    />
  );
}
