import Card from "@/components/ui/Card";

type ProteinRecommendationCardProps = {
  proteinFactor: number;
  proteinTargetGrams: number;
};

// Protein recommendation card for the nutrition calculator.
export default function ProteinRecommendationCard({
  proteinFactor,
  proteinTargetGrams,
}: ProteinRecommendationCardProps) {
  return (
    <Card className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Protein
        </p>

        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Daily protein recommendation
        </h3>

        <p className="mt-2 text-sm leading-7 text-slate-300">
          Protein is calculated from your estimated fat-free mass.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-sm text-slate-400">Protein factor</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {proteinFactor} g per lb of FFM
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-sm text-slate-400">Recommended intake</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {proteinTargetGrams} g/day
          </p>
        </div>
      </div>
    </Card>
  );
}