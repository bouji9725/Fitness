"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { calculateNutritionResults } from "@/lib/nutrition-calculations";
import NutritionSummaryCard from "./NutritionSummaryCard";
import ProteinRecommendationCard from "./ProteinRecommendationCard";

export default function NutritionCalculator() {
  const [weightKg, setWeightKg] = useState(80);
  const [bodyFatPercent, setBodyFatPercent] = useState(15);

  const results = useMemo(() => {
    return calculateNutritionResults({
      weightKg,
      bodyFatPercent,
    });
  }, [weightKg, bodyFatPercent]);

  return (
    <div className="grid gap-6">
      <Card className="grid gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Protein Target Calculator
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Estimate your daily protein needs based on fat-free mass and body fat percentage.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label
              htmlFor="weightKg"
              className="text-sm font-medium text-slate-700"
            >
              Body Weight (kg)
            </label>
            <input
              id="weightKg"
              type="number"
              min={1}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="bodyFatPercent"
              className="text-sm font-medium text-slate-700"
            >
              Body Fat (%)
            </label>
            <input
              id="bodyFatPercent"
              type="number"
              min={1}
              max={60}
              value={bodyFatPercent}
              onChange={(e) => setBodyFatPercent(Number(e.target.value))}
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <NutritionSummaryCard
          weightKg={weightKg}
          bodyFatPercent={bodyFatPercent}
          fatFreeMassKg={results.fatFreeMassKg}
          fatFreeMassLbs={results.fatFreeMassLbs}
        />

        <ProteinRecommendationCard
          proteinFactor={results.proteinFactor}
          proteinTargetGrams={results.proteinTargetGrams}
        />
      </div>
    </div>
  );
}