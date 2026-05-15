import Link from "next/link";
import Card from "@frontend/components/ui/Card";
import type { UserProfile } from "@shared/types/profile";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";
import type { BodyStatsEntry } from "@shared/types/progress";

type Props = {
  profile: UserProfile | null;
  latestBodyStats: BodyStatsEntry | null;
  nutritionSummary: NutritionResults | null;
  recentWorkout: WorkoutSessionRecord | null;
};

function formatGoal(goal?: UserProfile["goal"]): string {
  if (!goal) return "Not set";
  const labels: Record<string, string> = {
    "lose-weight": "Lose weight",
    "gain-muscle": "Gain muscle",
    "body-recomp": "Body recomposition",
    maintenance: "Maintenance",
  };
  return labels[goal] ?? "Not set";
}

export default function DashboardHero({
  profile,
  latestBodyStats,
  nutritionSummary,
  recentWorkout,
}: Props) {
  const displayName = profile?.name?.trim() || null;
  const greeting = displayName ? `Welcome back, ${displayName}` : "Welcome to Fitsler";

  const snippets = [
    profile?.goal ? { label: "Goal", value: formatGoal(profile.goal) } : null,
    latestBodyStats
      ? { label: "Weight", value: `${latestBodyStats.weightKg} kg` }
      : null,
    nutritionSummary
      ? { label: "Target", value: `${nutritionSummary.calorieTarget} kcal` }
      : null,
    recentWorkout
      ? { label: "Last workout", value: recentWorkout.session.templateName }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Today
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {greeting}
        </h2>
        {snippets.length === 0 && (
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Complete your profile to see personalized insights.{" "}
            <Link
              href="/profile"
              className="text-indigo-400 underline-offset-2 hover:underline"
            >
              Set up your profile →
            </Link>
          </p>
        )}
      </div>

      {snippets.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {snippets.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="text-xs text-slate-400">{label}</p>
              <p className="mt-1 text-base font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
