"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import UserProfileCard from "@/components/profile/UserProfileCard";
import ShareCoachCard from "@/components/profile/ShareCoachCard";
import { loadUserProfile, saveUserProfile } from "@/lib/data/profile";
import type { UserProfile } from "@/types/profile";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

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

  useEffect(() => {
    const savedProfile = loadUserProfile();

    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  function handleSaveProfile() {
    saveUserProfile(profile);
  }

  return (
    <AppShell>
      <PageHeader
        title="Profile"
        description="Manage your profile, fitness goal, and coach sharing settings."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="grid gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            Edit Profile
          </h2>

          <div className="grid gap-4">
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Your name"
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            />

            <input
              type="number"
              value={profile.age ?? ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  age: Number(e.target.value),
                }))
              }
              placeholder="Age"
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            />

            <input
              type="number"
              value={profile.heightCm ?? ""}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  heightCm: Number(e.target.value),
                }))
              }
              placeholder="Height (cm)"
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            />

            <select
              value={profile.goal ?? "gain-muscle"}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  goal: e.target.value as UserProfile["goal"],
                }))
              }
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            >
              <option value="lose-fat">Lose Fat</option>
              <option value="gain-muscle">Gain Muscle</option>
              <option value="recomp">Recomp</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={profile.coachSharingEnabled}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    coachSharingEnabled: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
              Share progress with Coach Budi
            </label>

            <Button type="button" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        </Card>

        <div className="grid gap-6">
          <UserProfileCard profile={profile} />
          <ShareCoachCard
            enabled={profile.coachSharingEnabled}
            coachName={profile.coachName}
          />
        </div>
      </div>
    </AppShell>
  );
}