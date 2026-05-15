import Link from "next/link";
import Card from "@frontend/components/ui/Card";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";

type Props = {
  profile: UserProfile;
  latestBodyStats: BodyStatsEntry | null;
  nutritionSummary: NutritionResults | null;
};

type CheckItem = {
  label: string;
  done: boolean;
  href: string;
};

export default function ProfileCompletenessCard({
  profile,
  latestBodyStats,
  nutritionSummary,
}: Props) {
  const items: CheckItem[] = [
    { label: "Name", done: Boolean(profile.name?.trim()), href: "/profile" },
    { label: "Age", done: Boolean(profile.age), href: "/profile" },
    {
      label: "Sex & height",
      done: Boolean(profile.sex && profile.heightCm),
      href: "/profile",
    },
    { label: "Fitness goal", done: Boolean(profile.goal), href: "/profile" },
    {
      label: "Progress entry",
      done: latestBodyStats !== null,
      href: "/progress",
    },
    {
      label: "Nutrition plan",
      done: nutritionSummary !== null,
      href: "/nutrition",
    },
  ];

  const doneCount = items.filter((i) => i.done).length;
  const pct = Math.round((doneCount / items.length) * 100);
  const allDone = doneCount === items.length;

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Setup
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Profile completeness
          </h3>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-center">
          <p className="text-2xl font-semibold text-white">{pct}%</p>
          <p className="text-xs text-slate-400">
            {doneCount}/{items.length} done
          </p>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {allDone ? (
        <p className="text-sm text-emerald-400">
          All fields complete. Your profile is ready to share.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items
            .filter((i) => !i.done)
            .map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 hover:bg-indigo-500/20"
              >
                Missing: {item.label} →
              </Link>
            ))}
        </div>
      )}
    </Card>
  );
}
