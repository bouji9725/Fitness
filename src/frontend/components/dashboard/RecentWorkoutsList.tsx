import { useState } from "react";
import Link from "next/link";
import Card from "@frontend/components/ui/Card";
import EmptyState from "@frontend/components/ui/EmptyState";
import type { WorkoutSessionRecord } from "@shared/types/workout";

type RecentWorkoutsListProps = {
  items: WorkoutSessionRecord[];
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onDelete: (sessionId: string) => Promise<void>;
};

export default function RecentWorkoutsList({
  items,
  hasMore,
  loadingMore,
  onLoadMore,
  onDelete,
}: RecentWorkoutsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(sessionId: string) {
    setDeletingId(sessionId);
    try {
      await onDelete(sessionId);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Activity
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Recent workouts
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Your latest saved workout sessions.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No workouts yet"
          description="Save a session to see it here."
          action={
            <Link
              href="/workouts"
              className="inline-flex min-h-9 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 px-4 text-sm font-medium text-white transition hover:bg-indigo-500/25"
            >
              Start a workout
            </Link>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item) => {
              const sessionId = item.session.id;
              const isDeleting = deletingId === sessionId;

              return (
                <article
                  key={sessionId}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-medium text-white">
                      {item.session.templateName}
                    </p>

                    <button
                      onClick={() => handleDelete(sessionId)}
                      disabled={isDeleting}
                      aria-label={`Delete ${item.session.templateName} session`}
                      className="shrink-0 rounded-lg px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/15 hover:text-red-300 disabled:opacity-40"
                    >
                      {isDeleting ? "Deleting…" : "Delete"}
                    </button>
                  </div>

                  <div className="mt-2 space-y-1 text-sm text-slate-300">
                    <p>
                      Performed:{" "}
                      {new Date(item.session.performedAt).toLocaleString()}
                    </p>
                    <p>Saved: {new Date(item.savedAt).toLocaleString()}</p>
                    {item.session.notes?.trim() ? (
                      <p className="mt-1 italic text-slate-400">
                        &ldquo;{item.session.notes}&rdquo;
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          {hasMore && (
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          )}
        </>
      )}
    </Card>
  );
}
