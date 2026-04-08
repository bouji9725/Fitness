import Card from "@/components/ui/Card";

type ProteinRecommendationCardProps = {
  proteinFactor: number;
  proteinTargetGrams: number;
};

export default function ProteinRecommendationCard({
  proteinFactor,
  proteinTargetGrams,
}: ProteinRecommendationCardProps) {
  return (
    <Card className="grid gap-3">
      <h3 className="text-xl font-semibold ">
        Daily Protein Recommendation
      </h3>

      <p className="text-sm ">
        Protein factor used:{" "}
        <span className="font-medium ">
          {proteinFactor} g per lb of FFM
        </span>
      </p>

      <div className="rounded-2xl px-4 py-4">
        <p className="text-sm ">Recommended daily protein</p>
        <p className="text-3xl font-bold ">
          {proteinTargetGrams} g/day
        </p>
      </div>
    </Card>
  );
}
