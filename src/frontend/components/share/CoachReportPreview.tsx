import Card from "@frontend/components/ui/Card";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";

type Props = {
  profile: UserProfile | null;
  latestBodyStats: BodyStatsEntry | null;
  nutritionSummary: NutritionResults | null;
  recentWorkouts: WorkoutSessionRecord[];
  totalWorkouts: number;
};

function formatGoal(goal?: UserProfile["goal"]): string {
  if (!goal) return "Not set";
  const labels: Record<NonNullable<UserProfile["goal"]>, string> = {
    "lose-weight": "Lose Weight",
    "gain-muscle": "Gain Muscle",
    "body-recomp": "Body Recomposition",
    maintenance: "Maintenance",
  };
  return labels[goal];
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export default function CoachReportPreview({
  profile,
  latestBodyStats,
  nutritionSummary,
  recentWorkouts,
  totalWorkouts,
}: Props) {
  const coachName = profile?.coachName?.trim();

  return (
    <Card className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Preview
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Coach report preview
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          {coachName ? `Prepared for ${coachName}.` : "No coach name set."}{" "}
          This is what gets exported.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Profile
          </p>
          <SummaryRow label="Name" value={profile?.name || "Not set"} />
          <SummaryRow label="Age" value={profile?.age ?? "Not set"} />
          <SummaryRow
            label="Height"
            value={
              profile?.heightCm != null
                ? `${profile.heightCm} cm`
                : "Not set"
            }
          />
          <SummaryRow label="Goal" value={formatGoal(profile?.goal)} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Body stats
          </p>
          {latestBodyStats ? (
            <>
              <SummaryRow
                label="Weight"
                value={`${latestBodyStats.weightKg} kg`}
              />
              <SummaryRow
                label="Body fat"
                value={`${latestBodyStats.bodyFatPercent}%`}
              />
              <SummaryRow label="Recorded" value={latestBodyStats.date} />
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
              No body stats recorded.
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Nutrition
          </p>
          {nutritionSummary ? (
            <>
              <SummaryRow
                label="Calories"
                value={`${nutritionSummary.calorieTarget} kcal`}
              />
              <SummaryRow
                label="Protein"
                value={`${nutritionSummary.proteinTargetGrams} g`}
              />
              <SummaryRow
                label="Fat"
                value={`${nutritionSummary.fatTargetGrams} g`}
              />
              <SummaryRow
                label="Carbs"
                value={`${nutritionSummary.carbsTargetGrams} g`}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
              No nutrition plan saved.
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Recent workouts ({totalWorkouts} total)
        </p>
        {recentWorkouts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
            No saved workout sessions yet.
          </div>
        ) : (
          <div className="space-y-2">
            {recentWorkouts.map((record) => {
              const key = `${record.savedAt}-${record.session.id}`;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="text-sm font-medium text-white">
                    {record.session.templateName}
                  </span>
                  <span className="text-sm text-slate-400">
                    {new Date(record.session.performedAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
