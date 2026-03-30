import Card from "@/components/ui/Card";

type MonthlyComparisonCardProps = {
  weightDiff: number;
  bodyFatDiff: number;
  muscleMassDiff: number | null;
};

export default function MonthlyComparisonCard({
  weightDiff,
  bodyFatDiff,
  muscleMassDiff,
}: MonthlyComparisonCardProps) {
  return (
    <Card className="grid gap-3">
      <h3 className="text-xl font-semibold text-slate-900">
        Latest Comparison
      </h3>

      <div className="grid gap-2 text-sm text-slate-600">
        <p>
          Weight change:{" "}
          <span className="font-medium text-slate-900">{weightDiff} kg</span>
        </p>
        <p>
          Body fat change:{" "}
          <span className="font-medium text-slate-900">{bodyFatDiff}%</span>
        </p>
        <p>
          Muscle mass change:{" "}
          <span className="font-medium text-slate-900">
            {muscleMassDiff ?? "N/A"} {muscleMassDiff != null ? "kg" : ""}
          </span>
        </p>
      </div>
    </Card>
  );
}