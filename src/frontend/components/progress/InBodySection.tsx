"use client";

import { useState } from "react";
import Button from "@frontend/components/ui/Button";
import Input from "@frontend/components/ui/Input";
import FormField from "@frontend/components/ui/FormField";
import EmptyState from "@frontend/components/ui/EmptyState";
import { addInBodyEntry, deleteInBodyEntry } from "@frontend/api/progress-api";
import { useToast } from "@frontend/context/ToastContext";
import { parseNumberInput } from "@shared/utils/number";
import type { InBodyEntry } from "@shared/types/progress";

type Props = {
  initialEntries: InBodyEntry[];
};

export default function InBodySection({ initialEntries }: Props) {
  const { toast } = useToast();
  const [entries, setEntries] = useState<InBodyEntry[]>(initialEntries);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weightKg, setWeightKg] = useState<number | undefined>();
  const [bodyFatPercent, setBodyFatPercent] = useState<number | undefined>();
  const [skeletalMuscleMassKg, setSkeletalMuscleMassKg] = useState<number | undefined>();
  const [fatFreeMassKg, setFatFreeMassKg] = useState<number | undefined>();
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSave() {
    if (weightKg == null || bodyFatPercent == null) return;
    setSaving(true);
    try {
      const entry = await addInBodyEntry({
        date,
        weightKg,
        bodyFatPercent,
        skeletalMuscleMassKg,
        fatFreeMassKg,
        notes: notes.trim() || undefined,
      });
      setEntries((prev) => [entry, ...prev]);
      setWeightKg(undefined);
      setBodyFatPercent(undefined);
      setSkeletalMuscleMassKg(undefined);
      setFatFreeMassKg(undefined);
      setNotes("");
      toast("InBody entry saved.", "success");
    } catch {
      toast("Failed to save InBody entry.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteInBodyEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast("InBody entry removed.", "success");
    } catch {
      toast("Failed to remove InBody entry.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const canSave = weightKg != null && bodyFatPercent != null;

  return (
    <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          InBody scan
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Body composition scan
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Log results from an InBody or similar body composition scan.
        </p>
      </div>

      {/* Form */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField label="Date" htmlFor="ib-date">
          <Input
            id="ib-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormField>

        <FormField label="Weight (kg)" htmlFor="ib-weight">
          <Input
            id="ib-weight"
            type="number"
            value={weightKg ?? ""}
            onChange={(e) => setWeightKg(parseNumberInput(e.target.value))}
            placeholder="e.g. 82.4"
          />
        </FormField>

        <FormField label="Body fat %" htmlFor="ib-fat">
          <Input
            id="ib-fat"
            type="number"
            value={bodyFatPercent ?? ""}
            onChange={(e) => setBodyFatPercent(parseNumberInput(e.target.value))}
            placeholder="e.g. 18.5"
          />
        </FormField>

        <FormField label="Skeletal muscle mass (kg)" htmlFor="ib-smm">
          <Input
            id="ib-smm"
            type="number"
            value={skeletalMuscleMassKg ?? ""}
            onChange={(e) => setSkeletalMuscleMassKg(parseNumberInput(e.target.value))}
            placeholder="Optional"
          />
        </FormField>

        <FormField label="Fat-free mass (kg)" htmlFor="ib-ffm">
          <Input
            id="ib-ffm"
            type="number"
            value={fatFreeMassKg ?? ""}
            onChange={(e) => setFatFreeMassKg(parseNumberInput(e.target.value))}
            placeholder="Optional"
          />
        </FormField>

        <FormField label="Notes" htmlFor="ib-notes">
          <Input
            id="ib-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
          />
        </FormField>
      </div>

      <Button variant="secondary" onClick={handleSave} disabled={!canSave || saving}>
        {saving ? "Saving…" : "Save scan"}
      </Button>

      {/* History */}
      {entries.length === 0 ? (
        <EmptyState title="No scan entries yet" description="Save your first InBody scan above." />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Weight</th>
                <th className="px-3 py-2 font-medium">Body fat</th>
                <th className="px-3 py-2 font-medium">Skeletal muscle</th>
                <th className="px-3 py-2 font-medium">Fat-free mass</th>
                <th className="px-3 py-2 font-medium">Notes</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="text-sm text-slate-200">
                  <td className="rounded-l-2xl border border-white/10 bg-white/5 px-3 py-3">{e.date}</td>
                  <td className="border-y border-white/10 bg-white/5 px-3 py-3">{e.weightKg} kg</td>
                  <td className="border-y border-white/10 bg-white/5 px-3 py-3">{e.bodyFatPercent}%</td>
                  <td className="border-y border-white/10 bg-white/5 px-3 py-3">
                    {e.skeletalMuscleMassKg != null ? `${e.skeletalMuscleMassKg} kg` : "—"}
                  </td>
                  <td className="border-y border-white/10 bg-white/5 px-3 py-3">
                    {e.fatFreeMassKg != null ? `${e.fatFreeMassKg} kg` : "—"}
                  </td>
                  <td className="border-y border-white/10 bg-white/5 px-3 py-3">{e.notes ?? "—"}</td>
                  <td className="rounded-r-2xl border border-white/10 bg-white/5 px-3 py-3">
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                      className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
                    >
                      {deletingId === e.id ? "…" : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
