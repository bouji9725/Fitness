import Card from "@frontend/components/ui/Card";
import Button from "@frontend/components/ui/Button";
import ProfileInfoRow from "./ProfileInfoRow";
import type { UserProfile } from "@shared/types/profile";

type Props = {
  profile: UserProfile;
  onEdit: () => void;
};

export default function BodyProfileCard({ profile, onEdit }: Props) {
  const rows = [
    {
      label: "Biological sex",
      value: profile.sex
        ? profile.sex.charAt(0).toUpperCase() + profile.sex.slice(1)
        : "Not set",
    },
    { label: "Age", value: profile.age ?? "Not set" },
    {
      label: "Height",
      value: profile.heightCm != null ? `${profile.heightCm} cm` : "Not set",
    },
  ];

  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Body
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Body profile
          </h3>
          <p className="mt-1 text-sm text-slate-300">
            Used to calculate your BMR and nutrition plan.
          </p>
        </div>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <ProfileInfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </Card>
  );
}
