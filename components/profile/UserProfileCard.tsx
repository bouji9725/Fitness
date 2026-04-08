import Card from "@/components/ui/Card";
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

export default function UserProfileCard({
  profile,
  onEditProfile,
  bodyComposition,
  nutritionPlan,
}: UserProfileCardProps) {
  const profileDetails = profile
    ? [
        { label: "Name", value: profile.name },
        { label: "Age", value: profile.age ?? "Not set" },
        {
          label: "Height",
          value: profile.heightCm != null ? `${profile.heightCm} cm` : "Not set",
        },
        { label: "Goal", value: formatGoal(profile.goal) },
      ]
    : [];

  const bodyCompositionRows = [
    { label: "Total Weight", value: `${bodyComposition.weightKg} kg` },
    { label: "Body Fat", value: `${bodyComposition.bodyFatPercent}%` },
    { label: "Fat-Free Mass", value: `${bodyComposition.fatFreeMassKg} kg` },
    { label: "Fat-Free Mass", value: `${bodyComposition.fatFreeMassLbs} lbs` },
  ];

  return (
    <Card className="grid gap-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-semibold ">User Profile</h2>

        <button
          type="button"
          onClick={onEditProfile}
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-medium  transition hover:bg-slate-100"
        >
          Edit Profile
        </button>
      </div>

      {!profile ? (
        <p className="text-sm ">No profile saved yet.</p>
      ) : (
        <div className="grid gap-6 text-sm ">
          <div className="grid gap-2">
            <h3 className="text-lg font-semibold ">Profile Details</h3>
            {profileDetails.map((item) => (
              <ProfileInfoRow
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>

          <div className="grid gap-2">
            <h3 className="text-lg font-semibold ">Body Composition Summary</h3>
            {bodyCompositionRows.map((item, index) => (
              <ProfileInfoRow
                key={`${item.label}-${index}`}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>

          <div className="grid gap-3">
            <h3 className="text-lg font-semibold ">Nutrition Plan Targets</h3>

            <div className="rounded-2xl bg-transparent px-4 border border-slate-200 py-4">
              <p className="text-sm ">Daily calorie target</p>
              <p className="text-2xl font-bold ">
                {nutritionPlan.calorieTarget} kcal
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-xl border border-slate-200 p-3">
                <ProfileInfoRow
                  label="Protein"
                  value={`${nutritionPlan.proteinTargetGrams} g`}
                  className="font-medium "
                />
                <ProfileInfoRow label="Calories" value={`${nutritionPlan.proteinCalories} kcal`} />
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <ProfileInfoRow
                  label="Fat"
                  value={`${nutritionPlan.fatTargetGrams} g`}
                  className="font-medium "
                />
                <p>
                  <span className="font-medium ">Calories:</span>{" "}
                  {nutritionPlan.fatCalories} kcal ({nutritionPlan.fatPercent}% of calories)
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <ProfileInfoRow
                  label="Carbs"
                  value={`${nutritionPlan.carbsTargetGrams} g`}
                  className="font-medium "
                />
                <ProfileInfoRow label="Calories" value={`${nutritionPlan.carbCalories} kcal`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
