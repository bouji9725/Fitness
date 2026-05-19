"use client";

import { useEffect, useState } from "react";
import Skeleton from "@frontend/components/ui/Skeleton";
import { useToast } from "@frontend/context/ToastContext";
import AppShell from "@frontend/components/layout/AppShell";
import PageContainer from "@frontend/components/layout/PageContainer";
import PageHeader from "@frontend/components/layout/PageHeader";
import Card from "@frontend/components/ui/Card";
import Button from "@frontend/components/ui/Button";
import Input from "@frontend/components/ui/Input";
import Select from "@frontend/components/ui/Select";
import FormField from "@frontend/components/ui/FormField";
import ProfileCompletenessCard from "@frontend/components/profile/ProfileCompletenessCard";
import ProfileBasicsCard from "@frontend/components/profile/ProfileBasicsCard";
import BodyProfileCard from "@frontend/components/profile/BodyProfileCard";
import FitnessGoalCard from "@frontend/components/profile/FitnessGoalCard";
import CoachSharingSettingsCard from "@frontend/components/profile/CoachSharingSettingsCard";
import { getProfile, updateProfile } from "@frontend/api/profile-api";
import { listProgressEntries } from "@frontend/api/progress-api";
import { getNutritionSummary } from "@frontend/api/nutrition-api";
import { getLatestBodyStats } from "@shared/calculations/progress";
import { parseNumberInput } from "@shared/utils/number";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";

const fallbackProfile: UserProfile = {
  id: "",
  name: "",
  age: undefined,
  heightCm: undefined,
  goal: undefined,
  coachSharingEnabled: false,
  coachName: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(fallbackProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [latestBodyStats, setLatestBodyStats] =
    useState<BodyStatsEntry | null>(null);
  const [nutritionSummary, setNutritionSummary] =
    useState<NutritionResults | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [savedProfile, bodyStatsEntries, nutrition] = await Promise.all([
          getProfile(),
          listProgressEntries(),
          getNutritionSummary(),
        ]);
        setProfile(savedProfile);
        setLatestBodyStats(getLatestBodyStats(bodyStatsEntries));
        setNutritionSummary(nutrition);
      } catch (err) {
        toast(
          err instanceof Error ? err.message : "Could not load profile",
          "error"
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [toast]);

  async function handleSaveProfile() {
    try {
      const savedProfile = await updateProfile(profile);
      const [bodyStatsEntries, nutrition] = await Promise.all([
        listProgressEntries(),
        getNutritionSummary(),
      ]);
      setProfile(savedProfile);
      setLatestBodyStats(getLatestBodyStats(bodyStatsEntries));
      setNutritionSummary(nutrition);
      setIsEditOpen(false);
      toast("Profile saved", "success");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Could not save profile",
        "error"
      );
    }
  }

  function openEdit() {
    setIsEditOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              onClick={() => setIsEditOpen((prev) => !prev)}
              variant="secondary"
            >
              {isEditOpen ? "Close editor" : "Edit profile"}
            </Button>
          }
        />

        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-20 rounded-[var(--radius-xl)]" />
            <div className="grid gap-6 xl:grid-cols-2">
              <Skeleton className="h-36 rounded-[var(--radius-xl)]" />
              <Skeleton className="h-36 rounded-[var(--radius-xl)]" />
              <Skeleton className="h-36 rounded-[var(--radius-xl)]" />
              <Skeleton className="h-36 rounded-[var(--radius-xl)]" />
            </div>
          </div>
        )}

        {!loading && (
          <div className="space-y-6">
            <ProfileCompletenessCard
              profile={profile}
              latestBodyStats={latestBodyStats}
              nutritionSummary={nutritionSummary}
            />

            {isEditOpen && (
              <Card className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
                    Profile editor
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                    Update your fitness profile
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">
                    These values connect your profile, progress, nutrition, and
                    sharing views.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Name" htmlFor="profile-name">
                    <Input
                      id="profile-name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Your name"
                    />
                  </FormField>

                  <FormField label="Biological sex" htmlFor="profile-sex">
                    <Select
                      id="profile-sex"
                      value={profile.sex ?? ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          sex: (e.target.value ||
                            undefined) as UserProfile["sex"],
                        }))
                      }
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Select>
                  </FormField>

                  <FormField label="Age" htmlFor="profile-age">
                    <Input
                      id="profile-age"
                      type="number"
                      value={profile.age ?? ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          age: parseNumberInput(e.target.value),
                        }))
                      }
                      placeholder="Age"
                    />
                  </FormField>

                  <FormField label="Height (cm)" htmlFor="profile-height">
                    <Input
                      id="profile-height"
                      type="number"
                      value={profile.heightCm ?? ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          heightCm: parseNumberInput(e.target.value),
                        }))
                      }
                      placeholder="Height"
                    />
                  </FormField>

                  <FormField label="Goal" htmlFor="profile-goal">
                    <Select
                      id="profile-goal"
                      value={profile.goal ?? ""}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          goal: (e.target.value ||
                            undefined) as UserProfile["goal"],
                        }))
                      }
                    >
                      <option value="">Not set</option>
                      <option value="lose-weight">Lose Weight</option>
                      <option value="gain-muscle">Gain Muscle</option>
                      <option value="body-recomp">Body Recomposition</option>
                      <option value="maintenance">Maintenance</option>
                    </Select>
                  </FormField>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-white">
                    Coach sharing
                  </p>

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
                    onClick={() => setIsEditOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            <div className="grid gap-6 xl:grid-cols-2">
              <ProfileBasicsCard name={profile.name} onEdit={openEdit} />
              <BodyProfileCard profile={profile} onEdit={openEdit} />
              <FitnessGoalCard goal={profile.goal} onEdit={openEdit} />
              <CoachSharingSettingsCard
                enabled={profile.coachSharingEnabled}
                coachName={profile.coachName}
                onManage={openEdit}
              />
            </div>
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}
