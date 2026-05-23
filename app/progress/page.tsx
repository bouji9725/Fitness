"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Skeleton from "@frontend/components/ui/Skeleton";
import EmptyState from "@frontend/components/ui/EmptyState";
import Button from "@frontend/components/ui/Button";
import Input from "@frontend/components/ui/Input";
import FormField from "@frontend/components/ui/FormField";
import { useToast } from "@frontend/context/ToastContext";
import AppShell from "@frontend/components/layout/AppShell";
import PageContainer from "@frontend/components/layout/PageContainer";
import PageHeader from "@frontend/components/layout/PageHeader";
import BodyStatsForm from "@frontend/components/profile/BodyStatsForm";
import BodyStatsChart from "@frontend/components/progress/BodyStatsChart";
import MonthlyComparisonCard from "@frontend/components/progress/MonthlyComparisonCard";
import InBodySection from "@frontend/components/progress/InBodySection";
import ProgressPhotoSection from "@frontend/components/progress/ProgressPhotoSection";
import {
  addProgressEntry,
  updateProgressEntry,
  deleteProgressEntry,
  listProgressEntries,
  listInBodyEntries,
  listProgressPhotos,
} from "@frontend/api/progress-api";
import {
  calculateBodyStatsDifference,
  getLatestBodyStats,
  getPreviousBodyStats,
} from "@shared/calculations/progress";
import { parseNumberInput } from "@shared/utils/number";
import type { BodyStatsEntry, InBodyEntry, ProgressPhotoEntry } from "@shared/types/progress";

type EditState = {
  id: string;
  date: string;
  weightKg: string;
  bodyFatPercent: string;
  muscleMassKg: string;
  notes: string;
};

export default function ProgressPage() {
  const [entries, setEntries] = useState<BodyStatsEntry[]>([]);
  const [inBodyEntries, setInBodyEntries] = useState<InBodyEntry[]>([]);
  const [photos, setPhotos] = useState<ProgressPhotoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [savedEntries, savedInBody, savedPhotos] = await Promise.all([
          listProgressEntries(),
          listInBodyEntries(),
          listProgressPhotos(),
        ]);
        setEntries(savedEntries);
        setInBodyEntries(savedInBody);
        setPhotos(savedPhotos);
      } catch (err) {
        toast(err instanceof Error ? err.message : "Could not load progress data", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  async function handleAddEntry(entry: BodyStatsEntry) {
    try {
      const updatedEntries = await addProgressEntry(entry);
      setEntries(updatedEntries);
      toast("Progress entry saved.", "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not save progress entry", "error");
    }
  }

  function startEdit(entry: BodyStatsEntry) {
    setEditState({
      id: entry.id,
      date: entry.date,
      weightKg: String(entry.weightKg),
      bodyFatPercent: String(entry.bodyFatPercent),
      muscleMassKg: entry.muscleMassKg != null ? String(entry.muscleMassKg) : "",
      notes: entry.notes ?? "",
    });
  }

  async function handleSaveEdit() {
    if (!editState) return;
    setSavingEdit(true);
    try {
      const updated = await updateProgressEntry(editState.id, {
        date: editState.date,
        weightKg: parseNumberInput(editState.weightKg) ?? 0,
        bodyFatPercent: parseNumberInput(editState.bodyFatPercent) ?? 0,
        muscleMassKg: parseNumberInput(editState.muscleMassKg),
        notes: editState.notes.trim() || undefined,
      });
      setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setEditState(null);
      toast("Entry updated.", "success");
    } catch {
      toast("Failed to update entry.", "error");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteProgressEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      if (editState?.id === id) setEditState(null);
      toast("Entry removed.", "success");
    } catch {
      toast("Failed to remove entry.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const latest = useMemo(() => getLatestBodyStats(entries), [entries]);
  const previous = useMemo(() => getPreviousBodyStats(entries), [entries]);
  const comparison = useMemo(() => calculateBodyStatsDifference(latest, previous), [latest, previous]);

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

        {loading ? (
          <div className="space-y-6">
            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <Skeleton className="h-72 rounded-[var(--radius-xl)]" />
              <div className="space-y-6">
                <Skeleton className="h-44 rounded-[var(--radius-xl)]" />
                <Skeleton className="h-28 rounded-[var(--radius-xl)]" />
              </div>
            </section>
            <Skeleton className="h-64 rounded-[var(--radius-xl)]" />
            <Skeleton className="h-48 rounded-[var(--radius-xl)]" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add entry + latest snapshot */}
            <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Check-in</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Add a progress entry</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Save your current body data to keep your progress history accurate and easy to compare.
                </p>
                <div className="mt-6">
                  <BodyStatsForm onAddEntry={handleAddEntry} />
                </div>
              </div>

              <div className="space-y-6">
                <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Latest data</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Latest snapshot</h2>
                  {latest ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-slate-400">Weight</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{latest.weightKg} kg</p>
                      </article>
                      <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-sm text-slate-400">Body fat</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{latest.bodyFatPercent}%</p>
                      </article>
                      <article className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
                        <p className="text-sm text-slate-400">Muscle mass</p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {latest.muscleMassKg != null ? `${latest.muscleMassKg} kg` : "Not recorded"}
                        </p>
                      </article>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <EmptyState title="No check-ins yet" description="Add your first entry using the form on the left." />
                    </div>
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
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Comparison</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Not enough data yet</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Add at least two progress entries to compare your latest check-in with the previous one.
                    </p>
                  </section>
                )}
              </div>
            </section>

            {/* Chart */}
            <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">Trends</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Weight &amp; body fat over time</h2>
              <div className="mt-6">
                <BodyStatsChart entries={entries} />
              </div>
            </section>

            {/* History with edit/delete */}
            <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">History</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">Saved check-ins</h2>

              {entries.length === 0 ? (
                <div className="mt-5">
                  <EmptyState title="No history yet" description="Your saved check-ins will appear here." />
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {entries.map((entry) => {
                    const isEditing = editState?.id === entry.id;
                    const isDeleting = deletingId === entry.id;

                    if (isEditing && editState) {
                      return (
                        <div key={entry.id} className="rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4 space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <FormField label="Date" htmlFor={`edit-date-${entry.id}`}>
                              <Input id={`edit-date-${entry.id}`} type="date" value={editState.date} onChange={(e) => setEditState((s) => s && ({ ...s, date: e.target.value }))} />
                            </FormField>
                            <FormField label="Weight (kg)" htmlFor={`edit-weight-${entry.id}`}>
                              <Input id={`edit-weight-${entry.id}`} type="number" value={editState.weightKg} onChange={(e) => setEditState((s) => s && ({ ...s, weightKg: e.target.value }))} />
                            </FormField>
                            <FormField label="Body fat %" htmlFor={`edit-fat-${entry.id}`}>
                              <Input id={`edit-fat-${entry.id}`} type="number" value={editState.bodyFatPercent} onChange={(e) => setEditState((s) => s && ({ ...s, bodyFatPercent: e.target.value }))} />
                            </FormField>
                            <FormField label="Muscle mass (kg)" htmlFor={`edit-muscle-${entry.id}`}>
                              <Input id={`edit-muscle-${entry.id}`} type="number" value={editState.muscleMassKg} onChange={(e) => setEditState((s) => s && ({ ...s, muscleMassKg: e.target.value }))} placeholder="Optional" />
                            </FormField>
                          </div>
                          <FormField label="Notes" htmlFor={`edit-notes-${entry.id}`}>
                            <Input id={`edit-notes-${entry.id}`} type="text" value={editState.notes} onChange={(e) => setEditState((s) => s && ({ ...s, notes: e.target.value }))} placeholder="Optional" />
                          </FormField>
                          <div className="flex gap-3">
                            <Button variant="primary" onClick={handleSaveEdit} disabled={savingEdit}>{savingEdit ? "Saving…" : "Save"}</Button>
                            <Button variant="ghost" onClick={() => setEditState(null)}>Cancel</Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={entry.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-5 text-sm">
                          <span className="text-slate-400 sm:hidden text-xs">Date</span>
                          <span className="text-white font-medium">{entry.date}</span>
                          <span className="text-slate-300">{entry.weightKg} kg</span>
                          <span className="text-slate-300">{entry.bodyFatPercent}%</span>
                          <span className="text-slate-300">{entry.muscleMassKg != null ? `${entry.muscleMassKg} kg` : "—"}</span>
                          <span className="text-slate-400 truncate">{entry.notes?.trim() || "—"}</span>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button onClick={() => startEdit(entry)} className="text-xs text-indigo-300 hover:text-indigo-200 transition">Edit</button>
                          <button onClick={() => handleDelete(entry.id)} disabled={isDeleting} className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50">
                            {isDeleting ? "…" : "Remove"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* InBody scan */}
            <InBodySection initialEntries={inBodyEntries} />

            {/* Progress photos */}
            <ProgressPhotoSection initialPhotos={photos} />
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
