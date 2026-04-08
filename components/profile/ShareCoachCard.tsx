import Card from "@/components/ui/Card";

type ShareCoachCardProps = {
  enabled: boolean;
  coachName?: string;
};

export default function ShareCoachCard({
  enabled,
  coachName,
}: ShareCoachCardProps) {
  return (
    <Card className="grid gap-3">
      <h3 className="text-xl font-semibold ">Coach Sharing</h3>

      <p className="text-sm ">
        {enabled
          ? `Your progress can be shared with ${coachName ?? "your coach"}.`
          : "Coach sharing is currently disabled."}
      </p>
    </Card>
  );
}
