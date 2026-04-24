"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import BodyStatsForm from "@/components/profile/BodyStatsForm";
import MonthlyComparisonCard from "@/components/progress/MonthlyComparisonCard";
import {
  addProgressEntry,
  listProgressEntries,
} from "@/lib/api/progress-api";
import {
  calculateBodyStatsDifference,
  getLatestBodyStats,
  getPreviousBodyStats,
} from "@/lib/calculations/progress";
import type { BodyStatsEntry } from "@/types/progress";

export default function ProgressPage() {
  const [entries, setEntries] = useState<BodyStatsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgressEntries() {
      try {
        setLoading(true);
        setError(null);

        const savedEntries = await listProgressEntries();

        setEntries(savedEntries);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading progress data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProgressEntries();
  }, []);

  async function handleAddEntry(entry: BodyStatsEntry) {
    try {
      setSaving(true);
      setError(null);

      const updatedEntries = await addProgressEntry(entry);

      setEntries(updatedEntries);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving progress data."
      );
    } finally {
      setSaving(false);
    }
  }

  const latest = useMemo(() => getLatestBodyStats(entries), [entries]);
  const previous = useMemo(() => getPreviousBodyStats(entries), [entries]);

  const comparison = useMemo(() => {
    return calculateBodyStatsDifference(latest, previous);
  }, [latest, previous]);

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Progress tracking"
          title="Progress"
          description="Record body stats, review your latest check-in, and compare changes over time."
          actions={
            <Link
              href="/share"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Review share summary
            </Link>
          }
        />

        {error ? (
          <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100">
            {error}
          </section>
        ) : null}

        {loading ? (
          <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
            Loading progress data...
          </section>
        ) : (
          <>
            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                  Check-in
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Add a progress entry
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Save your current body data to keep your progress history
                  accurate and easy to compare.
                </p>

                <div className="mt-6">
                  <BodyStatsForm onAddEntry={handleAddEntry} />
                </div>

                {saving ? (
                  <p className="mt-4 text-sm text-slate-300">
                    Saving progress entry...
                  </p>
                ) : null}
              </div>

              <div className="space-y-6">
                <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                    Latest data
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    Latest snapshot
                  </h2>

                  {latest ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-slate-400">Weight</p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {latest.weightKg} kg
                        </p>
                      </article>

                      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-slate-400">Body fat</p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {latest.bodyFatPercent}%
                        </p>
                      </article>

                      <article className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                        <p className="text-sm text-slate-400">Muscle mass</p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {latest.muscleMassKg != null
                            ? `${latest.muscleMassKg} kg`
                            : "Not recorded"}
                        </p>
                      </article>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      No progress entries yet. Add your first check-in to start
                      tracking changes.
                    </p>
                  )}
                </section>

                {comparison ? (
                  <MonthlyComparisonCard
                    weightDiff={comparison.weightDiff}
                    bodyFatDiff={comparison.bodyFatDiff}
                    muscleMassDiff={comparison.muscleMassDiff}
                  />
                ) : (
                  <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                      Comparison
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      Not enough data yet
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Add at least two progress entries to compare your latest
                      check-in with the previous one.
                    </p>
                  </section>
                )}
              </div>
            </section>

            <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                History
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Saved check-ins
              </h2>

              {entries.length === 0 ? (
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  No entries saved yet.
                </p>
              ) : (
                <div className="mt-5 overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-3">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                        <th className="px-3 py-2 font-medium">Date</th>
                        <th className="px-3 py-2 font-medium">Weight</th>
                        <th className="px-3 py-2 font-medium">Body fat</th>
                        <th className="px-3 py-2 font-medium">Muscle mass</th>
                        <th className="px-3 py-2 font-medium">Notes</th>
                      </tr>
                    </thead>

                    <tbody>
                      {entries.map((entry) => (
                        <tr key={entry.id} className="text-sm text-slate-200">
                          <td className="rounded-l-2xl border border-white/10 bg-white/5 px-3 py-3">
                            {entry.date}
                          </td>
                          <td className="border-y border-white/10 bg-white/5 px-3 py-3">
                            {entry.weightKg} kg
                          </td>
                          <td className="border-y border-white/10 bg-white/5 px-3 py-3">
                            {entry.bodyFatPercent}%
                          </td>
                          <td className="border-y border-white/10 bg-white/5 px-3 py-3">
                            {entry.muscleMassKg != null
                              ? `${entry.muscleMassKg} kg`
                              : "—"}
                          </td>
                          <td className="rounded-r-2xl border border-white/10 bg-white/5 px-3 py-3">
                            {entry.notes?.trim() ? entry.notes : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </PageContainer>
    </AppShell>
  );
}