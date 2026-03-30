import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type SharePermissionCardProps = {
  sharingEnabled: boolean;
  coachName: string;
  onToggle: () => void;
};

export default function SharePermissionCard({
  sharingEnabled,
  coachName,
  onToggle,
}: SharePermissionCardProps) {
  return (
    <Card className="grid gap-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Share with {coachName}
        </h2>
        <p className="text-sm text-slate-500">
          Decide whether your latest tracking data can be shared with your coach.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-50 px-4 py-4">
        <p className="text-sm text-slate-600">Current sharing status</p>
        <p className="text-lg font-semibold text-slate-900">
          {sharingEnabled ? "Enabled" : "Disabled"}
        </p>
      </div>

      <div>
        <Button type="button" onClick={onToggle}>
          {sharingEnabled ? "Disable Sharing" : "Enable Sharing"}
        </Button>
      </div>
    </Card>
  );
}