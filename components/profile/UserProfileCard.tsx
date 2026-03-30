import Card from "@/components/ui/Card";
import type { UserProfile } from "@/types/profile";

type UserProfileCardProps = {
  profile: UserProfile | null;
};

export default function UserProfileCard({ profile }: UserProfileCardProps) {
  return (
    <Card className="grid gap-3">
      <h2 className="text-2xl font-semibold text-slate-900">User Profile</h2>

      {!profile ? (
        <p className="text-sm text-slate-500">No profile saved yet.</p>
      ) : (
        <div className="grid gap-2 text-sm text-slate-600">
          <p>
            Name: <span className="font-medium text-slate-900">{profile.name}</span>
          </p>
          {profile.age ? (
            <p>
              Age: <span className="font-medium text-slate-900">{profile.age}</span>
            </p>
          ) : null}
          {profile.heightCm ? (
            <p>
              Height:{" "}
              <span className="font-medium text-slate-900">
                {profile.heightCm} cm
              </span>
            </p>
          ) : null}
          {profile.goal ? (
            <p>
              Goal: <span className="font-medium text-slate-900">{profile.goal}</span>
            </p>
          ) : null}
        </div>
      )}
    </Card>
  );
}