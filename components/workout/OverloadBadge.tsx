type OverloadBadgeProps = {
  improved: boolean;
};

export default function OverloadBadge({ improved }: OverloadBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        improved
          ? "bg-green-100 text-green-700"
          : "bg-slate-500 "
      }`}
    >
      {improved ? "Overload achieved" : "Match previous"}
    </span>
  );
}
