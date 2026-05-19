type EmptyStateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <svg
          className="h-5 w-5 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-4v4"
          />
        </svg>
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">{description}</p>

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
