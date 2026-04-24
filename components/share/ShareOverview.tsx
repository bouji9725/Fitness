"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { getProfile } from "@/lib/api/profile-api";
import { listProgressEntries } from "@/lib/api/progress-api";
import { getNutritionSummary } from "@/lib/api/nutrition-api";
import { listSavedWorkoutSessions } from "@/lib/api/workouts-api";
import { getLatestBodyStats } from "@/lib/calculations/progress";
import type { UserProfile } from "@/types/profile";
import type { BodyStatsEntry } from "@/types/progress";
import type { NutritionResults } from "@/types/nutrition";
import type { WorkoutSessionRecord } from "@/types/workout";

type ShareData = {
  profile: UserProfile | null;
  progressEntries: BodyStatsEntry[];
  nutritionSummary: NutritionResults | null;
  workoutHistory: WorkoutSessionRecord[];
};

function formatGoal(goal?: UserProfile["goal"]): string {
  if (!goal) return "Not set";
  if (goal === "lose-fat") return "Lose Fat";
  if (goal === "gain-muscle") return "Gain Muscle";
  if (goal === "recomp") return "Recomp";
  return "Maintenance";
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString();
}

// Coach-ready share summary.
// This component now reads from API clients only.
// That keeps the share page aligned with the app's API-first architecture.
export default function ShareOverview() {
  const [data, setData] = useState<ShareData>({
    profile: null,
    progressEntries: [],
    nutritionSummary: null,
    workoutHistory: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadShareData() {
      try {
        setLoading(true);
        setError(null);

        const [
          profile,
          progressEntries,
          nutritionSummary,
          workoutHistory,
        ] = await Promise.all([
          getProfile(),
          listProgressEntries(),
          getNutritionSummary(),
          listSavedWorkoutSessions(),
        ]);

        setData({
          profile,
          progressEntries,
          nutritionSummary,
          workoutHistory,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the share summary."
        );
      } finally {
        setLoading(false);
      }
    }

    loadShareData();
  }, []);

  const latestBodyStats = useMemo(() => {
    return getLatestBodyStats(data.progressEntries);
  }, [data.progressEntries]);

  const recentWorkouts = useMemo(() => {
    return data.workoutHistory.slice(0, 5);
  }, [data.workoutHistory]);

  const sharingEnabled = !!data.profile?.coachSharingEnabled;
  const coachName = data.profile?.coachName?.trim() || "";

  if (loading) {
    return (
      <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
        Loading share summary...
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100">
        {error}
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Status
          </p>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Sharing readiness
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-300">
            This summary is built from the current API data for profile,
            progress, nutrition, and workout history.
          </p>
        </div>

        <div
          className={[
            "rounded-2xl border px-4 py-4 text-sm leading-7",
            sharingEnabled
              ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
              : "border-white/10 bg-white/5 text-slate-300",
          ].join(" ")}
        >
          {sharingEnabled
            ? `Sharing is enabled${coachName ? ` for ${coachName}` : ""}.`
            : "Sharing is currently disabled in the profile settings."}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Profile
            </p>

            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
              Identity and goal
            </h3>
          </div>

          <div className="space-y-3">
            <SummaryRow label="Name" value={data.profile?.name || "Not set"} />
            <SummaryRow label="Age" value={data.profile?.age ?? "Not set"} />
            <SummaryRow
              label="Height"
              value={
                data.profile?.heightCm != null
                  ? `${data.profile.heightCm} cm`
                  : "Not set"
              }
            />
            <SummaryRow label="Goal" value={formatGoal(data.profile?.goal)} />
            <SummaryRow label="Coach" value={coachName || "Not set"} />
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Progress
            </p>

            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
              Latest body data
            </h3>
          </div>

          {latestBodyStats ? (
            <div className="space-y-3">
              <SummaryRow label="Date" value={latestBodyStats.date} />
              <SummaryRow
                label="Weight"
                value={`${latestBodyStats.weightKg} kg`}
              />
              <SummaryRow
                label="Body fat"
                value={`${latestBodyStats.bodyFatPercent}%`}
              />
              <SummaryRow
                label="Muscle mass"
                value={
                  latestBodyStats.muscleMassKg != null
                    ? `${latestBodyStats.muscleMassKg} kg`
                    : "Not recorded"
                }
              />
              <SummaryRow
                label="Progress entries"
                value={data.progressEntries.length}
              />
            </div>
          ) : (
            <EmptySummary message="No body stats have been saved yet." />
          )}
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Nutrition
            </p>

            <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
              Current plan
            </h3>
          </div>

          {data.nutritionSummary ? (
            <div className="space-y-3">
              <SummaryRow
                label="Calories"
                value={`${data.nutritionSummary.calorieTarget} kcal`}
              />
              <SummaryRow
                label="Protein"
                value={`${data.nutritionSummary.proteinTargetGrams} g`}
              />
              <SummaryRow
                label="Fat"
                value={`${data.nutritionSummary.fatTargetGrams} g`}
              />
              <SummaryRow
                label="Carbs"
                value={`${data.nutritionSummary.carbsTargetGrams} g`}
              />
            </div>
          ) : (
            <EmptySummary message="No nutrition summary has been saved yet." />
          )}
        </Card>
      </div>

      <Card className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Workouts
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              Recent saved sessions
            </h3>

            <p className="mt-2 text-sm leading-7 text-slate-300">
              The latest saved sessions included in the coach-ready summary.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm text-slate-400">Total saved sessions</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {data.workoutHistory.length}
            </p>
          </div>
        </div>

        {recentWorkouts.length === 0 ? (
          <EmptySummary message="No saved workout sessions yet." />
        ) : (
          <div className="space-y-3">
            {recentWorkouts.map((item) => {
              const itemKey = `${item.savedAt}-${item.session.performedAt}-${item.session.templateName}`;

              return (
                <article
                  key={itemKey}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-base font-medium text-white">
                    {item.session.templateName}
                  </p>

                  <div className="mt-2 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                    <p>Performed: {formatDateTime(item.session.performedAt)}</p>
                    <p>Saved: {formatDateTime(item.savedAt)}</p>
                    <p>Exercises: {item.session.exercises.length}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string | number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function EmptySummary({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
      {message}
    </div>
  );
}