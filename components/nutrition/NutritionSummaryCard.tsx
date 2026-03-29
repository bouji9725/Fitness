import Card from "@/components/ui/Card";

type NutritionSummaryCardProps = {
  weightKg: number;
  bodyFatPercent: number;
  fatFreeMassKg: number;
  fatFreeMassLbs: number;
};

export default function NutritionSummaryCard({
  weightKg,
  bodyFatPercent,
  fatFreeMassKg,
  fatFreeMassLbs,
}: NutritionSummaryCardProps) {
  return (
    <Card className="grid gap-3">
      <h3 className="text-xl font-semibold text-slate-900">
        Body Composition Summary
      </h3>

      <div className="grid gap-2 text-sm text-slate-600">
        <p>
          Total Weight: <span className="font-medium text-slate-900">{weightKg} kg</span>
        </p>
        <p>
          Body Fat: <span className="font-medium text-slate-900">{bodyFatPercent}%</span>
        </p>
        <p>
          Fat-Free Mass:{" "}
          <span className="font-medium text-slate-900">{fatFreeMassKg} kg</span>
        </p>
        <p>
          Fat-Free Mass:{" "}
          <span className="font-medium text-slate-900">{fatFreeMassLbs} lbs</span>
        </p>
      </div>
    </Card>
  );
}