"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import UserProfileCard from "@/components/profile/UserProfileCard";
import ShareCoachCard from "@/components/profile/ShareCoachCard";
import { loadUserProfile, saveUserProfile } from "@/lib/data/profile";
import { loadBodyStats } from "@/lib/data/progress";
import type { UserProfile } from "@/types/profile";
import type { BodyStatsEntry } from "@/types/progress";
import type { NutritionGoal } from "@/types/nutrition";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormField from "@/components/ui/FormField";
import Label from "@/components/ui/Label";
import { parseNumberInput } from "@/lib/utils/number";
import { loadNutritionSummary } from "@/lib/data/nutrition";
import { calculateNutritionResults } from "@/lib/calculations/nutrition";
import { getLatestBodyStats } from "@/lib/calculations/progress";
import { P } from "@/components/ui/Fonts";

function mapProfileGoalToNutritionGoal(goal?: UserProfile["goal"]): NutritionGoal {
    if (goal === "lose-fat") return "lose-weight";
    if (goal === "recomp") return "body-recomp";
    return "gain-muscle";
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>({
        id: "user-1",
        name: "Abdel",
        age: 25,
        heightCm: 180,
        goal: "gain-muscle",
        coachSharingEnabled: false,
        coachName: "Coach Budi",
    });
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [latestBodyStats, setLatestBodyStats] = useState<BodyStatsEntry | null>(
        null
    );
    const [savedNutritionSummary, setSavedNutritionSummary] = useState(
        loadNutritionSummary()
    );

    useEffect(() => {
        const savedProfile = loadUserProfile();
        const bodyStatsEntries = loadBodyStats();

        if (savedProfile) {
            setProfile(savedProfile);
        }

        setLatestBodyStats(getLatestBodyStats(bodyStatsEntries));
        setSavedNutritionSummary(loadNutritionSummary());
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

    function handleSaveProfile() {
        saveUserProfile(profile);
        setSavedNutritionSummary(loadNutritionSummary());
        setLatestBodyStats(getLatestBodyStats(loadBodyStats()));
        setIsEditProfileOpen(false);
    }

    return (
        <AppShell>
            <PageHeader
                title="Profile"
                description="Manage your profile, fitness goal, and coach sharing settings."
            />

            {isEditProfileOpen ? (
                <Card className="mb-6 grid gap-4">
                    <h2 className="text-2xl font-semibold ">
                        Edit Profile
                    </h2>

                    <div className="grid gap-4">
                        <FormField label="Name" htmlFor="profile-name">
                            <Input
                                id="profile-name"
                                type="text"
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
                                placeholder="Height (cm)"
                            />
                        </FormField>

                        <FormField label="Goal" htmlFor="profile-goal">
                            <Select
                                id="profile-goal"
                                value={profile.goal ?? "gain-muscle"}
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

                        <div className="grid gap-2">
                            <Label htmlFor="coach-sharing">Coach Sharing</Label>

                            <label
                                htmlFor="coach-sharing"
                                className="flex items-center gap-3 text-sm "
                            >
                                <input
                                    id="coach-sharing"
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
                                Share progress with Coach Budi
                            </label>
                        </div>

                        <Button type="button" onClick={handleSaveProfile}>
                            Save Profile
                        </Button>
                    </div>
                </Card>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-1">
                <UserProfileCard
                    profile={profile}
                    onEditProfile={() => setIsEditProfileOpen((prev) => !prev)}
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
            </div>
        </AppShell>
    );
}
