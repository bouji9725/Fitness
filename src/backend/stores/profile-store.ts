import { prisma } from "@backend/prisma/prisma";
import type { UserProfile } from "@shared/types/profile";

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
  async getProfile(userId: string): Promise<UserProfile> {
    const row = await prisma.userProfile.findUnique({ where: { id: userId } });

    return row
      ? rowToProfile(row)
      : {
          id: userId,
          name: "",
          coachSharingEnabled: false,
        };
  },

  async saveProfile(userId: string, profile: UserProfile): Promise<UserProfile> {
    const data = {
      name: profile.name,
      age: profile.age ?? null,
      heightCm: profile.heightCm ?? null,
      goal: profile.goal ?? null,
      coachSharingEnabled: profile.coachSharingEnabled,
      coachName: profile.coachName ?? null,
    };

    const row = await prisma.userProfile.upsert({
      where: { id: userId },
      create: { id: userId, ...data },
      update: data,
    });

    return rowToProfile(row);
  },
};
