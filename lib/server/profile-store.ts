import type { UserProfile } from "@/types/profile";

const defaultProfile: UserProfile = {
  id: "user-1",
  name: "User",
  age: 25,
  heightCm: 180,
  goal: "gain-muscle",
  coachSharingEnabled: false,
  coachName: "",
};

declare global {
  var __fitnessProfileStore: UserProfile | undefined;
}

export const profileStore = {
  getProfile(): UserProfile {
    if (!globalThis.__fitnessProfileStore) {
      globalThis.__fitnessProfileStore = defaultProfile;
    }

    return globalThis.__fitnessProfileStore;
  },

  saveProfile(profile: UserProfile): UserProfile {
    globalThis.__fitnessProfileStore = {
      ...profile,
      id: profile.id || "user-1",
    };

    return globalThis.__fitnessProfileStore;
  },
};