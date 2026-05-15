import Link from "next/link";
import Card from "@frontend/components/ui/Card";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";

type Props = {
  profile: UserProfile | null;
  latestBodyStats: BodyStatsEntry | null;
  nutritionSummary: NutritionResults | null;
  savedWorkouts: WorkoutSessionRecord[];
};

type ReadinessItem = {
  label: string;
  done: boolean;
  href: string;
};

export default function ShareReadinessCard({
  profile,
  latestBodyStats,
  nutritionSummary,
  savedWorkouts,
}: Props) {
  const items: ReadinessItem[] = [
    {
      label: "Profile complete (name, age, sex, height)",
      done: Boolean(
        profile?.name?.trim() &&
          profile.age &&
          profile.heightCm &&
          profile.sex
      ),
      href: "/profile",
    },
    {
      label: "Fitness goal set",
      done: Boolean(profile?.goal),
      href: "/profile",
    },
    {
      label: "Body stats recorded",
      done: latestBodyStats !== null,
      href: "/progress",
    },
    {
      label: "Nutrition plan calculated",
      done: nutritionSummary !== null,
      href: "/nutrition",
    },
    {
      label: "Coach sharing enabled",
      done: Boolean(profile?.coachSharingEnabled),
      href: "/profile",
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const allReady = doneCount === items.length;

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Readiness
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Report readiness
          </h3>
          <p className="mt-1 text-sm text-slate-300">
            Complete all items to generate a full coach report.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
          <p className="text-2xl font-semibold text-white">
            {doneCount}/{items.length}
          </p>
          <p className="text-xs text-slate-400">ready</p>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {item.done ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/5 text-slate-500">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              )}
              <span
                className={`text-sm ${item.done ? "text-slate-300" : "text-slate-400"}`}
              >
                {item.label}
              </span>
            </div>
            {!item.done && (
              <Link
                href={item.href}
                className="shrink-0 text-xs text-indigo-400 underline-offset-2 hover:underline"
              >
                Fix →
              </Link>
            )}
          </div>
        ))}
      </div>

      {allReady && (
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          Your report is ready to share. Use the export options below.
        </div>
      )}
    </Card>
  );
}
