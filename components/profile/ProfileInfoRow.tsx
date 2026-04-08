import type { ReactNode } from "react";

type ProfileInfoRowProps = {
  label: string;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
};

export default function ProfileInfoRow({
  label,
  value,
  className = "",
  valueClassName = "font-medium ",
}: ProfileInfoRowProps) {
  return (
    <p className={className}>
      {label}: <span className={valueClassName}>{value}</span>
    </p>
  );
}

