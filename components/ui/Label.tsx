import type { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ className = "", ...props }: LabelProps) {
  return (
    <label
      className={className}
      {...props}
    />
  );
}
