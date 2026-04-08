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
      <h3 className="text-xl font-semibold ">
        Body Composition Summary
      </h3>

      <div className="grid gap-2 text-sm ">
        <p>
          Total Weight: <span className="font-medium ">{weightKg} kg</span>
        </p>
        <p>
          Body Fat: <span className="font-medium ">{bodyFatPercent}%</span>
        </p>
        <p>
          Fat-Free Mass:{" "}
          <span className="font-medium ">{fatFreeMassKg} kg</span>
        </p>
        <p>
          Fat-Free Mass:{" "}
          <span className="font-medium ">{fatFreeMassLbs} lbs</span>
        </p>
      </div>
    </Card>
  );
}
