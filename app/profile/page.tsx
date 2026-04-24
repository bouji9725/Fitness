"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import UserProfileCard from "@/components/profile/UserProfileCard";
import ShareCoachCard from "@/components/profile/ShareCoachCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormField from "@/components/ui/FormField";
import { getProfile, updateProfile } from "@/lib/api/profile-api";
import { loadBodyStats } from "@/lib/data/progress";
import { loadNutritionSummary } from "@/lib/data/nutrition";
import { calculateNutritionResults } from "@/lib/calculations/nutrition";
import { getLatestBodyStats } from "@/lib/calculations/progress";
import { parseNumberInput } from "@/lib/utils/number";
import type { UserProfile } from "@/types/profile";
import type { BodyStatsEntry } from "@/types/progress";
import type { NutritionGoal } from "@/types/nutrition";

function mapProfileGoalToNutritionGoal(
  goal?: UserProfile["goal"]
): NutritionGoal {
  if (goal === "lose-fat") return "lose-weight";
  if (goal === "recomp") return "body-recomp";
  return "gain-muscle";
}

const fallbackProfile: UserProfile = {
  id: "user-1",
  name: "User",
  age: 25,
  heightCm: 180,
  goal: "gain-muscle",
  coachSharingEnabled: false,
  coachName: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(fallbackProfile);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [latestBodyStats, setLatestBodyStats] =
    useState<BodyStatsEntry | null>(null);
  const [savedNutritionSummary, setSavedNutritionSummary] = useState(
    loadNutritionSummary()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfilePageData() {
      try {
        setLoading(true);
        setError(null);

        const savedProfile = await getProfile();
        const bodyStatsEntries = loadBodyStats();

        setProfile(savedProfile);
        setLatestBodyStats(getLatestBodyStats(bodyStatsEntries));
        setSavedNutritionSummary(loadNutritionSummary());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfilePageData();
  }, []);

  const bodyWeightKg = latestBodyStats?.weightKg ?? 80;
  const bodyFatPercent = latestBodyStats?.bodyFatPercent ?? 15;

  const fallbackNutrition = useMemo(() => {
    return calculateNutritionResults({
      weightKg: bodyWeightKg,
      bodyFatPercent,
      bmr: 1800,
      tdee: 2600,
      goal: mapProfileGoalToNutritionGoal(profile.goal),
      adjustment: 500,
      recompDirection: "slight-deficit",
    });
  }, [bodyWeightKg, bodyFatPercent, profile.goal]);

  const nutritionToShow = savedNutritionSummary ?? fallbackNutrition;

  async function handleSaveProfile() {
    try {
      setError(null);

      const savedProfile = await updateProfile(profile);

      setProfile(savedProfile);
      setSavedNutritionSummary(loadNutritionSummary());
      setLatestBodyStats(getLatestBodyStats(loadBodyStats()));
      setIsEditProfileOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the profile."
      );
    }
  }

  return (
    <AppShell>
      <PageContainer>
        <PageHeader
          eyebrow="Personal settings"
          title="Profile"
          description="Manage your fitness goal, body context, and coach-sharing preferences."
          actions={
            <Button
              onClick={() => setIsEditProfileOpen((prev) => !prev)}
              variant="secondary"
            >
              {isEditProfileOpen ? "Close editor" : "Edit profile"}
            </Button>
          }
        />

        {loading ? (
          <section className="app-surface rounded-[var(--radius-xl)] p-6 text-sm text-slate-300">
            Loading profile...
          </section>
        ) : null}

        {error ? (
          <section className="rounded-[var(--radius-xl)] border border-red-400/25 bg-red-500/10 p-6 text-sm text-red-100">
            {error}
          </section>
        ) : null}

        {!loading && isEditProfileOpen ? (
          <Card className="space-y-6 rounded-[var(--radius-xl)] p-5 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                Profile editor
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Update your fitness profile
              </h2>

              <p className="mt-2 text-sm leading-7 text-slate-300">
                These values help connect your profile, progress, nutrition, and
                sharing views.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Name" htmlFor="profile-name">
                <Input
                  id="profile-name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your name"
                />
              </FormField>

              <FormField label="Age" htmlFor="profile-age">
                <Input
                  id="profile-age"
                  type="number"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      age: parseNumberInput(e.target.value) ?? 0,
                    }))
                  }
                  placeholder="Age"
                />
              </FormField>

              <FormField label="Height (cm)" htmlFor="profile-height">
                <Input
                  id="profile-height"
                  type="number"
                  value={profile.heightCm}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      heightCm: parseNumberInput(e.target.value) ?? 0,
                    }))
                  }
                  placeholder="Height"
                />
              </FormField>

              <FormField label="Goal" htmlFor="profile-goal">
                <Select
                  id="profile-goal"
                  value={profile.goal}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      goal: e.target.value as UserProfile["goal"],
                    }))
                  }
                >
                  <option value="lose-fat">Lose Fat</option>
                  <option value="gain-muscle">Gain Muscle</option>
                  <option value="recomp">Recomp</option>
                  <option value="maintenance">Maintenance</option>
                </Select>
              </FormField>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">Coach sharing</p>

              <label className="mt-4 flex items-center gap-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={profile.coachSharingEnabled}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      coachSharingEnabled: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                Prepare profile summary for coach review
              </label>

              <div className="mt-4">
                <FormField label="Coach name" htmlFor="coach-name">
                  <Input
                    id="coach-name"
                    value={profile.coachName ?? ""}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        coachName: e.target.value,
                      }))
                    }
                    placeholder="Coach name"
                  />
                </FormField>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSaveProfile}>Save profile</Button>

              <Button
                variant="secondary"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        ) : null}

        {!loading ? (
          <section className="grid gap-6 xl:grid-cols-2">
            <UserProfileCard
              profile={profile}
              onEditProfile={() => setIsEditProfileOpen(true)}
              bodyComposition={{
                weightKg: bodyWeightKg,
                bodyFatPercent,
                fatFreeMassKg: nutritionToShow.fatFreeMassKg,
                fatFreeMassLbs: nutritionToShow.fatFreeMassLbs,
              }}
              nutritionPlan={{
                calorieTarget: nutritionToShow.calorieTarget,
                fatPercent: nutritionToShow.fatPercent,
                proteinTargetGrams: nutritionToShow.proteinTargetGrams,
                fatTargetGrams: nutritionToShow.fatTargetGrams,
                carbsTargetGrams: nutritionToShow.carbsTargetGrams,
                proteinCalories: nutritionToShow.proteinCalories,
                fatCalories: nutritionToShow.fatCalories,
                carbCalories: nutritionToShow.carbCalories,
              }}
            />

            <ShareCoachCard
              enabled={profile.coachSharingEnabled}
              coachName={profile.coachName}
            />
          </section>
        ) : null}
      </PageContainer>
    </AppShell>
  );
}