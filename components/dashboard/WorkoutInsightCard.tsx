import Card from "@/components/ui/Card";

type WorkoutInsightCardProps = {
  title: string;
  description: string;
  value: string | number;
  helperText?: string;
};

// Secondary dashboard insight card.
// Use this for supporting dashboard context, not for top-level KPI stats.
export default function WorkoutInsightCard({
  title,
  description,
  value,
  helperText,
}: WorkoutInsightCardProps) {
  return (
    <Card className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Insight
        </p>

        <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          {description}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        <p className="text-sm text-slate-400">Value</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>

        {helperText ? (
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {helperText}
          </p>
        ) : null}
      </div>
    </Card>
  );
}