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

const FEATURE_TILES = [
  {
    label: "Track workouts",
    desc: "Log sets, track volume, save sessions",
    href: "/workouts",
  },
  {
    label: "Monitor progress",
    desc: "Record body stats, compare check-ins",
    href: "/progress",
  },
  {
    label: "Plan nutrition",
    desc: "Calculate calorie and macro targets",
    href: "/nutrition",
  },
];

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
            Complete the setup steps below to unlock personalized metrics, calorie targets, and training insights.
          </p>
        )}
      </div>

      {snippets.length === 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {FEATURE_TILES.map(({ label, desc, href }) => (
            <Link
              key={label}
              href={href}
              className="group rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-indigo-400/30 hover:bg-indigo-500/10"
            >
              <p className="text-sm font-medium text-slate-200 transition group-hover:text-white">
                {label}
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">{desc}</p>
            </Link>
          ))}
        </div>
      ) : (
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
