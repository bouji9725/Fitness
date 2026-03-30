export type UserProfile = {
  id: string;
  name: string;
  age?: number;
  heightCm?: number;
  goal?: "lose-fat" | "gain-muscle" | "recomp" | "maintenance";
  coachSharingEnabled: boolean;
  coachName?: string;
};