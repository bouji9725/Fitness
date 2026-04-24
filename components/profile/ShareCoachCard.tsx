import Card from "@/components/ui/Card";

type ShareCoachCardProps = {
  enabled: boolean;
  coachName?: string;
};

// Coach sharing status card.
// Keep the message clear and trustworthy.
export default function ShareCoachCard({
  enabled,
  coachName,
}: ShareCoachCardProps) {
  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Sharing
        </p>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Coach sharing status
        </h2>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Control whether your current fitness summary is prepared for coach review.
        </p>
      </div>

      <div
        className={[
          "rounded-2xl border px-4 py-4 text-sm leading-7",
          enabled
            ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
            : "border-white/10 bg-white/5 text-slate-300",
        ].join(" ")}
      >
        {enabled
          ? `Sharing is enabled${coachName ? ` for ${coachName}` : ""}.`
          : "Sharing is currently disabled."}
      </div>
    </Card>
  );
}