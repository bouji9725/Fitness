import Card from "@/components/ui/Card";

type NutritionSummaryCardProps = {
  weightKg: number;
  bodyFatPercent: number;
  fatFreeMassKg: number;
  fatFreeMassLbs: number;
};

// Body composition summary for the nutrition flow.
export default function NutritionSummaryCard({
  weightKg,
  bodyFatPercent,
  fatFreeMassKg,
  fatFreeMassLbs,
}: NutritionSummaryCardProps) {
  const rows = [
    { label: "Weight", value: `${weightKg} kg` },
    { label: "Body fat", value: `${bodyFatPercent}%` },
    { label: "Fat-free mass", value: `${fatFreeMassKg} kg` },
    { label: "Fat-free mass (lbs)", value: `${fatFreeMassLbs} lbs` },
  ];

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Body data
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Body composition summary
        </h3>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <span className="text-sm text-slate-400">{row.label}</span>
            <span className="text-sm font-medium text-white">{row.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}