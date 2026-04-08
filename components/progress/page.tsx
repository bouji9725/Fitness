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
      <h3 className="text-xl font-semibold ">
        Latest Comparison
      </h3>

      <div className="grid gap-2 text-sm ">
        <p>
          Weight change:{" "}
          <span className="font-medium ">{weightDiff} kg</span>
        </p>
        <p>
          Body fat change:{" "}
          <span className="font-medium ">{bodyFatDiff}%</span>
        </p>
        <p>
          Muscle mass change:{" "}
          <span className="font-medium ">
            {muscleMassDiff ?? "N/A"} {muscleMassDiff != null ? "kg" : ""}
          </span>
        </p>
      </div>
    </Card>
  );
}
