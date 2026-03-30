"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import BodyStatsForm from "@/components/profile/BodyStatsForm";
import MonthlyComparisonCard from "@/components/progress/MonthlyComparisonCard";
import { loadBodyStats, saveBodyStats } from "@/lib/profile-storage";
import {
  calculateBodyStatsDifference,
  getLatestBodyStats,
  getPreviousBodyStats,
} from "@/lib/progress-calculations";
import type { BodyStatsEntry } from "@/types/progress";

export default function ProgressPage() {
  const [entries, setEntries] = useState<BodyStatsEntry[]>([]);

  useEffect(() => {
    setEntries(loadBodyStats());
  }, []);

  function handleAddEntry(entry: BodyStatsEntry) {
    const updated = [entry, ...entries];
    setEntries(updated);
    saveBodyStats(updated);
  }

  const latest = useMemo(() => getLatestBodyStats(entries), [entries]);
  const previous = useMemo(() => getPreviousBodyStats(entries), [entries]);
  const comparison = useMemo(
    () => calculateBodyStatsDifference(latest, previous),
    [latest, previous]
  );

  return (
    <AppShell>
      <PageHeader
        title="Progress Tracking"
        description="Track weight, body fat, muscle mass, and compare month by month."
      />

      <div className="grid gap-6">
        <BodyStatsForm onAddEntry={handleAddEntry} />

        {comparison ? (
          <MonthlyComparisonCard
            weightDiff={comparison.weightDiff}
            bodyFatDiff={comparison.bodyFatDiff}
            muscleMassDiff={comparison.muscleMassDiff}
          />
        ) : null}
      </div>
    </AppShell>
  );
}