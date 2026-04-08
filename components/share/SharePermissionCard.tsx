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
        <h2 className="text-2xl font-semibold ">
          Share with {coachName}
        </h2>
        <p className="text-sm ">
          Decide whether your latest tracking data can be shared with your coach.
        </p>
      </div>

      <div className="rounded-2xl border border-bg-blur-200 px-4 py-4">
        <p className="text-sm ">Current sharing status</p>
        <p className="text-lg font-semibold ">
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
