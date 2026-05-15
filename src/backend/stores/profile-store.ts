import { prisma } from "@backend/prisma/prisma";
import type { UserProfile } from "@shared/types/profile";

const DEFAULT_ID = "user-1";

const defaultProfile: UserProfile = {
  id: DEFAULT_ID,
  name: "User",
  age: 25,
  heightCm: 180,
  goal: "gain-muscle",
  coachSharingEnabled: false,
  coachName: "",
};

function rowToProfile(row: {
  id: string;
  name: string;
  age: number | null;
  heightCm: number | null;
  goal: string | null;
  coachSharingEnabled: boolean;
  coachName: string | null;
}): UserProfile {
  return {
    id: row.id,
    name: row.name,
    age: row.age ?? undefined,
    heightCm: row.heightCm ?? undefined,
    goal: (row.goal as UserProfile["goal"]) ?? undefined,
    coachSharingEnabled: row.coachSharingEnabled,
    coachName: row.coachName ?? undefined,
  };
}

export const profileStore = {
  async getProfile(): Promise<UserProfile> {
    const row = await prisma.userProfile.findUnique({
      where: { id: DEFAULT_ID },
    });

    return row ? rowToProfile(row) : defaultProfile;
  },

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const data = {
      name: profile.name,
      age: profile.age ?? null,
      heightCm: profile.heightCm ?? null,
      goal: profile.goal ?? null,
      coachSharingEnabled: profile.coachSharingEnabled,
      coachName: profile.coachName ?? null,
    };

    const row = await prisma.userProfile.upsert({
      where: { id: DEFAULT_ID },
      create: { id: DEFAULT_ID, ...data },
      update: data,
    });

    return rowToProfile(row);
  },
};
