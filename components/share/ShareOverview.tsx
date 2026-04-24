"use client";

"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { loadUserProfile } from "@/lib/data/profile";
import { loadBodyStats } from "@/lib/data/progress";
import { loadNutritionSummary } from "@/lib/data/nutrition";
import { loadAllWorkoutSessions } from "@/lib/data/workouts";
import { getLatestBodyStats } from "@/lib/calculations/progress";
import type { UserProfile } from "@/types/profile";
import type { BodyStatsEntry } from "@/types/progress";
import type { NutritionResults } from "@/types/nutrition";
import type { WorkoutSessionRecord } from "@/types/workout";

function formatGoal(goal?: UserProfile["goal"]): string {
  if (!goal) return "Not set";
  if (goal === "lose-fat") return "Lose Fat";
  if (goal === "gain-muscle") return "Gain Muscle";
  if (goal === "recomp") return "Recomp";
  return "Maintenance";
}

// Share overview for coach-facing summary preparation.
// This component explains what data is currently available to share.
export default function ShareOverview() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [latestBodyStats, setLatestBodyStats] = useState<BodyStatsEntry | null>(null);
const [nutritionSummary, setNutritionSummary] = useState<NutritionResults | null>(null);  const [workoutHistory, setWorkoutHistory] = useState<WorkoutSessionRecord[]>([]);

  useEffect(() => {
    const nextProfile = loadUserProfile();
    const nextBodyStats = loadBodyStats();
    const nextNutrition = loadNutritionSummary();
    const nextWorkoutHistory = loadAllWorkoutSessions();

    setProfile(nextProfile);
    setLatestBodyStats(getLatestBodyStats(nextBodyStats));
    setNutritionSummary(nextNutrition);
    setWorkoutHistory(nextWorkoutHistory);
  }, []);

  const recentWorkouts = useMemo(() => workoutHistory.slice(0, 5), [workoutHistory]);

  const sharingEnabled = !!profile?.coachSharingEnabled;
  const coachName = profile?.coachName?.trim() || "";

  return (
    <div className="space-y-6">
      {/* Sharing status */}
      <Card className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Status
          </p>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Sharing readiness
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-300">
            This screen summarizes the information currently prepared for sharing.
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

      {/* Summary blocks */}
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
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-1 text-sm font-medium text-white">
                {profile?.name?.trim() || "Not set"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-slate-400">Goal</p>
              <p className="mt-1 text-sm font-medium text-white">
                {formatGoal(profile?.goal)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-slate-400">Coach</p>
              <p className="mt-1 text-sm font-medium text-white">
                {coachName || "Not set"}
              </p>
            </div>
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
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">Date</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {latestBodyStats.date}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">Weight</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {latestBodyStats.weightKg} kg
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">Body fat</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {latestBodyStats.bodyFatPercent}%
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">Muscle mass</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {latestBodyStats.muscleMassKg != null
                    ? `${latestBodyStats.muscleMassKg} kg`
                    : "Not recorded"}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              No body stats have been saved yet.
            </div>
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

          {nutritionSummary ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">Calories</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {nutritionSummary.calorieTarget} kcal
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">Protein</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {nutritionSummary.proteinTargetGrams} g
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">Fat</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {nutritionSummary.fatTargetGrams} g
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">Carbs</p>
                <p className="mt-1 text-sm font-medium text-white">
                  {nutritionSummary.carbsTargetGrams} g
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              No nutrition summary has been saved yet.
            </div>
          )}
        </Card>
      </div>

      {/* Workout history */}
      <Card className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Workouts
          </p>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Recent saved sessions
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-300">
            These are the latest workout sessions currently available in the shared summary.
          </p>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            No saved workout sessions yet.
          </div>
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

                  <div className="mt-2 space-y-1 text-sm text-slate-300">
                    <p>
                      Performed: {new Date(item.session.performedAt).toLocaleString()}
                    </p>
                    <p>
                      Saved: {new Date(item.savedAt).toLocaleString()}
                    </p>
                    <p>
                      Exercises: {item.session.exercises.length}
                    </p>
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