import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProfileInfoRow from "./ProfileInfoRow";
import type { UserProfile } from "@/types/profile";

type UserProfileCardProps = {
  profile: UserProfile | null;
  onEditProfile: () => void;
  bodyComposition: {
    weightKg: number;
    bodyFatPercent: number;
    fatFreeMassKg: number;
    fatFreeMassLbs: number;
  };
  nutritionPlan: {
    calorieTarget: number;
    fatPercent: number;
    proteinTargetGrams: number;
    fatTargetGrams: number;
    carbsTargetGrams: number;
    proteinCalories: number;
    fatCalories: number;
    carbCalories: number;
  };
};

function formatGoal(goal?: UserProfile["goal"]): string {
  if (!goal) return "Not set";
  if (goal === "lose-fat") return "Lose Fat";
  if (goal === "gain-muscle") return "Gain Muscle";
  if (goal === "recomp") return "Recomp";
  return "Maintenance";
}

// Main profile summary card.
// Keep this card structured around identity, body composition, and nutrition context.
export default function UserProfileCard({
  profile,
  onEditProfile,
  bodyComposition,
  nutritionPlan,
}: UserProfileCardProps) {
  const profileDetails = profile
    ? [
        { label: "Name", value: profile.name || "Not set" },
        { label: "Age", value: profile.age ?? "Not set" },
        {
          label: "Height",
          value: profile.heightCm != null ? `${profile.heightCm} cm` : "Not set",
        },
        { label: "Goal", value: formatGoal(profile.goal) },
      ]
    : [];

  const bodyCompositionRows = [
    { label: "Weight", value: `${bodyComposition.weightKg} kg` },
    { label: "Body fat", value: `${bodyComposition.bodyFatPercent}%` },
    { label: "Fat-free mass", value: `${bodyComposition.fatFreeMassKg} kg` },
    { label: "Fat-free mass (lbs)", value: `${bodyComposition.fatFreeMassLbs} lbs` },
  ];

  const macroRows = [
    { label: "Daily calories", value: `${nutritionPlan.calorieTarget} kcal` },
    { label: "Protein", value: `${nutritionPlan.proteinTargetGrams} g` },
    { label: "Fat", value: `${nutritionPlan.fatTargetGrams} g` },
    { label: "Carbs", value: `${nutritionPlan.carbsTargetGrams} g` },
  ];

  return (
    <Card className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Profile
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Personal fitness profile
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-300">
            Review your core body data, current goal, and nutrition targets in one place.
          </p>
        </div>

        <Button variant="secondary" onClick={onEditProfile}>
          Edit profile
        </Button>
      </div>

      {!profile ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          No profile saved yet.
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Profile details</h3>
            <div className="space-y-3">
              {profileDetails.map((item) => (
                <ProfileInfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Body composition</h3>
            <div className="space-y-3">
              {bodyCompositionRows.map((item) => (
                <ProfileInfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Nutrition targets</h3>
            <div className="space-y-3">
              {macroRows.map((item) => (
                <ProfileInfoRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              Fat calories: {nutritionPlan.fatCalories} kcal ({nutritionPlan.fatPercent}%)
            </div>
          </section>
        </>
      )}
    </Card>
  );
}