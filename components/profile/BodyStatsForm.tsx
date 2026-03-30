"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { BodyStatsEntry } from "@/types/progress";

type BodyStatsFormProps = {
  onAddEntry: (entry: BodyStatsEntry) => void;
};

export default function BodyStatsForm({ onAddEntry }: BodyStatsFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weightKg, setWeightKg] = useState(80);
  const [bodyFatPercent, setBodyFatPercent] = useState(15);
  const [muscleMassKg, setMuscleMassKg] = useState(35);
  const [notes, setNotes] = useState("");

  function handleSubmit() {
    const entry: BodyStatsEntry = {
      id: `body-stats-${Date.now()}`,
      date,
      weightKg,
      bodyFatPercent,
      muscleMassKg,
      notes,
    };

    onAddEntry(entry);
    setNotes("");
  }

  return (
    <Card className="grid gap-4">
      <h3 className="text-xl font-semibold text-slate-900">Add Body Stats</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="min-h-11 rounded-xl border border-slate-200 px-3"
        />

        <input
          type="number"
          value={weightKg}
          onChange={(e) => setWeightKg(Number(e.target.value))}
          placeholder="Weight (kg)"
          className="min-h-11 rounded-xl border border-slate-200 px-3"
        />

        <input
          type="number"
          value={bodyFatPercent}
          onChange={(e) => setBodyFatPercent(Number(e.target.value))}
          placeholder="Body Fat %"
          className="min-h-11 rounded-xl border border-slate-200 px-3"
        />

        <input
          type="number"
          value={muscleMassKg}
          onChange={(e) => setMuscleMassKg(Number(e.target.value))}
          placeholder="Muscle Mass (kg)"
          className="min-h-11 rounded-xl border border-slate-200 px-3"
        />
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
        className="min-h-24 rounded-xl border border-slate-200 px-3 py-3"
      />

      <div>
        <Button type="button" onClick={handleSubmit}>
          Save Body Stats
        </Button>
      </div>
    </Card>
  );
}