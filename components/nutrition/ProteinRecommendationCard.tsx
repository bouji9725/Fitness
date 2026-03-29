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
      <h3 className="text-xl font-semibold text-slate-900">
        Daily Protein Recommendation
      </h3>

      <p className="text-sm text-slate-600">
        Protein factor used:{" "}
        <span className="font-medium text-slate-900">
          {proteinFactor} g per lb of FFM
        </span>
      </p>

      <div className="rounded-2xl bg-blue-50 px-4 py-4">
        <p className="text-sm text-slate-600">Recommended daily protein</p>
        <p className="text-3xl font-bold text-slate-900">
          {proteinTargetGrams} g/day
        </p>
      </div>
    </Card>
  );
}