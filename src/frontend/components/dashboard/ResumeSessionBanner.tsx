import Link from "next/link";
import type { WorkoutSession } from "@shared/types/workout";

type Props = {
  sessions: WorkoutSession[];
};

function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export default function ResumeSessionBanner({ sessions }: Props) {
  if (sessions.length === 0) return null;

  const primary = sessions[0];

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-amber-400/25 bg-amber-500/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 min-w-0">
        {/* Pulse dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
        </span>

        <div className="min-w-0">
          <p className="text-sm font-medium text-amber-100">
            Active workout session
          </p>
          <p className="mt-0.5 truncate text-xs text-amber-200/70">
            {primary.templateName} &middot; started {timeAgo(primary.createdAt)}
            {sessions.length > 1 && ` · ${sessions.length - 1} more`}
          </p>
        </div>
      </div>

      <Link
        href={`/workouts/${primary.id}`}
        className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-500/25"
      >
        Resume session
      </Link>
    </div>
  );
}
