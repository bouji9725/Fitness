import Link from "next/link";
import Card from "@frontend/components/ui/Card";
import Button from "@frontend/components/ui/Button";

type Props = {
  enabled: boolean;
  coachName?: string;
  onManage: () => void;
};

export default function CoachSharingSettingsCard({
  enabled,
  coachName,
  onManage,
}: Props) {
  const trimmedCoachName = coachName?.trim();

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Coach
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          Coach sharing
        </h3>
        <p className="mt-1 text-sm text-slate-300">
          Share your progress summary with a coach or trainer.
        </p>
      </div>

      <div
        className={[
          "space-y-1 rounded-2xl border px-4 py-4",
          enabled
            ? "border-emerald-400/25 bg-emerald-500/10"
            : "border-white/10 bg-white/5",
        ].join(" ")}
      >
        <p
          className={`text-sm font-medium ${enabled ? "text-emerald-300" : "text-slate-300"}`}
        >
          {enabled ? "Sharing enabled" : "Sharing disabled"}
        </p>
        {enabled && trimmedCoachName && (
          <p className="text-sm text-slate-400">Coach: {trimmedCoachName}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onManage}>
          {enabled ? "Manage sharing" : "Enable sharing"}
        </Button>
        {enabled && (
          <Link href="/share">
            <Button variant="secondary">View share page →</Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
