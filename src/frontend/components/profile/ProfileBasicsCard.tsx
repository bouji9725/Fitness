import Card from "@frontend/components/ui/Card";
import Button from "@frontend/components/ui/Button";
import ProfileInfoRow from "./ProfileInfoRow";

type Props = {
  name: string;
  onEdit: () => void;
};

export default function ProfileBasicsCard({ name, onEdit }: Props) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Account
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
            Profile basics
          </h3>
          <p className="mt-1 text-sm text-slate-300">
            Your display name in Fitsler.
          </p>
        </div>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      </div>

      <ProfileInfoRow label="Name" value={name || "Not set"} />
    </Card>
  );
}
