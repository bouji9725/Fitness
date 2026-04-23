"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import BodyStatsForm from "@/components/profile/BodyStatsForm";
import MonthlyComparisonCard from "@/components/progress/MonthlyComparisonCard";
import { loadBodyStats, saveBodyStats } from "@/lib/data/progress";
import {
  calculateBodyStatsDifference,
  getLatestBodyStats,
  getPreviousBodyStats,
} from "@/lib/calculations/progress";
import type { BodyStatsEntry } from "@/types/progress";

// Progress tracking page.
// This page owns body composition tracking and historical comparison.
// Structure it around:
// - adding a new entry
// - latest insights
// - historical context
export default function ProgressPage() {
  const [entries, setEntries] = useState<BodyStatsEntry[]>([]);

  useEffect(() => {
    setEntries(loadBodyStats());
  }, []);

  function handleAddEntry(entry: BodyStatsEntry) {
    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    saveBodyStats(updatedEntries);
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
          title="Progress"
          description="Track body measurements over time and compare your latest update with the previous check-in."
          actions={
            <Link
              href="/dashboard"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Back to dashboard
            </Link>
          }
        />

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              New entry
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Add body stats
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Save a new progress entry to keep your measurements organized and
              easy to compare over time.
            </p>

            <div className="mt-6">
              <BodyStatsForm onAddEntry={handleAddEntry} />
            </div>
          </div>

          <div className="space-y-6">
            <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                Latest snapshot
              </p>

              {latest ? (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                  No body stats saved yet. Add your first entry to start
                  tracking progress.
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

                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Add at least two entries to unlock a meaningful comparison
                  between your latest and previous body stats.
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
                    <tr
                      key={entry.id}
                      className="text-sm text-slate-200"
                    >
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
                        {entry.muscleMassKg != null ? `${entry.muscleMassKg} kg` : "—"}
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
      </PageContainer>
    </AppShell>
  );
}