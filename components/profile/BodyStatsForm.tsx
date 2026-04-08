"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import FormField from "@/components/ui/FormField";
import type { BodyStatsEntry } from "@/types/progress";
import { parseNumberInput } from "@/lib/utils/number";

type BodyStatsFormProps = {
  onAddEntry: (entry: BodyStatsEntry) => void;
};

export default function BodyStatsForm({ onAddEntry }: BodyStatsFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weightKg, setWeightKg] = useState<number | undefined>(80);
  const [bodyFatPercent, setBodyFatPercent] = useState<number | undefined>(15);
  const [muscleMassKg, setMuscleMassKg] = useState<number | undefined>(35);
  const [notes, setNotes] = useState("");

  function handleSubmit() {
    const entry: BodyStatsEntry = {
      id: `body-stats-${Date.now()}`,
      date,
      weightKg: weightKg ?? 0,
      bodyFatPercent: bodyFatPercent ?? 0,
      muscleMassKg,
      notes,
    };

    onAddEntry(entry);
    setNotes("");
  }

  return (
    <Card className="grid gap-4">
      <h3 className="text-xl font-semibold ">Add Body Stats</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Date" htmlFor="body-stats-date">
          <Input
            id="body-stats-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormField>

        <FormField label="Weight (kg)" htmlFor="body-stats-weight">
          <Input
            id="body-stats-weight"
            type="number"
            value={weightKg ?? ""}
            onChange={(e) => setWeightKg(parseNumberInput(e.target.value))}
            placeholder="Weight (kg)"
          />
        </FormField>

        <FormField label="Body Fat %" htmlFor="body-stats-bodyfat">
          <Input
            id="body-stats-bodyfat"
            type="number"
            value={bodyFatPercent ?? ""}
            onChange={(e) => setBodyFatPercent(parseNumberInput(e.target.value))}
            placeholder="Body Fat %"
          />
        </FormField>

        <FormField label="Muscle Mass (kg)" htmlFor="body-stats-muscle">
          <Input
            id="body-stats-muscle"
            type="number"
            value={muscleMassKg ?? ""}
            onChange={(e) => setMuscleMassKg(parseNumberInput(e.target.value))}
            placeholder="Muscle Mass (kg)"
          />
        </FormField>
      </div>

      <FormField label="Notes" htmlFor="body-stats-notes">
        <Textarea
          id="body-stats-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes"
        />
      </FormField>

      <div>
        <Button type="button" variant="secondary" onClick={handleSubmit}>
          Save Body Stats
        </Button>
      </div>
    </Card>
  );
}
