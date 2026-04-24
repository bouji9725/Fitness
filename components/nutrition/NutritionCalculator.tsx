"use client";

"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import FormField from "@/components/ui/FormField";
import { calculateNutritionResults } from "@/lib/calculations/nutrition";
import { saveNutritionSummary } from "@/lib/data/nutrition";
import { parseNumberInput } from "@/lib/utils/number";
import NutritionSummaryCard from "./NutritionSummaryCard";
import ProteinRecommendationCard from "./ProteinRecommendationCard";
import NutritionPlanCard from "./NutritionPlanCard";
import type { NutritionGoal, RecompDirection } from "@/types/nutrition";

// Nutrition calculator.
// Keep the form clear, then show outputs in dedicated summary cards.
export default function NutritionCalculator() {
  const [weightKg, setWeightKg] = useState<number | undefined>(80);
  const [bodyFatPercent, setBodyFatPercent] = useState<number | undefined>(15);
  const [bmr, setBmr] = useState<number | undefined>(1800);
  const [tdee, setTdee] = useState<number | undefined>(2600);
  const [goal, setGoal] = useState<NutritionGoal>("gain-muscle");
  const [adjustment, setAdjustment] = useState<number | undefined>(500);
  const [recompDirection, setRecompDirection] =
    useState<RecompDirection>("slight-deficit");

  const safeWeightKg = weightKg ?? 0;
  const safeBodyFatPercent = bodyFatPercent ?? 0;
  const safeBmr = bmr ?? 0;
  const safeTdee = tdee ?? 0;
  const safeAdjustment = adjustment ?? 0;

  const results = useMemo(() => {
    return calculateNutritionResults({
      weightKg: safeWeightKg,
      bodyFatPercent: safeBodyFatPercent,
      bmr: safeBmr,
      tdee: safeTdee,
      goal,
      adjustment: safeAdjustment,
      recompDirection,
    });
  }, [
    safeWeightKg,
    safeBodyFatPercent,
    safeBmr,
    safeTdee,
    goal,
    safeAdjustment,
    recompDirection,
  ]);

  useEffect(() => {
    saveNutritionSummary(results);
  }, [results]);

  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Inputs
          </p>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Nutrition plan calculator
          </h3>

          <p className="mt-2 text-sm leading-7 text-slate-300">
            Estimate fat-free mass, calories, protein, fats, and carbs based on your goal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FormField label="Weight (kg)" htmlFor="nutrition-weight">
            <Input
              id="nutrition-weight"
              type="number"
              value={weightKg ?? ""}
              onChange={(e) => setWeightKg(parseNumberInput(e.target.value))}
            />
          </FormField>

          <FormField label="Body fat (%)" htmlFor="nutrition-body-fat">
            <Input
              id="nutrition-body-fat"
              type="number"
              value={bodyFatPercent ?? ""}
              onChange={(e) =>
                setBodyFatPercent(parseNumberInput(e.target.value))
              }
            />
          </FormField>

          <FormField label="BMR" htmlFor="nutrition-bmr">
            <Input
              id="nutrition-bmr"
              type="number"
              value={bmr ?? ""}
              onChange={(e) => setBmr(parseNumberInput(e.target.value))}
            />
          </FormField>

          <FormField label="TDEE" htmlFor="nutrition-tdee">
            <Input
              id="nutrition-tdee"
              type="number"
              value={tdee ?? ""}
              onChange={(e) => setTdee(parseNumberInput(e.target.value))}
            />
          </FormField>

          <FormField label="Goal" htmlFor="nutrition-goal">
            <Select
              id="nutrition-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as NutritionGoal)}
            >
              <option value="lose-weight">Lose weight</option>
              <option value="gain-muscle">Gain muscle</option>
              <option value="body-recomp">Body recomposition</option>
            </Select>
          </FormField>

          <FormField label="Adjustment" htmlFor="nutrition-adjustment">
            <Input
              id="nutrition-adjustment"
              type="number"
              value={adjustment ?? ""}
              onChange={(e) => setAdjustment(parseNumberInput(e.target.value))}
            />
          </FormField>
        </div>

        {goal === "body-recomp" ? (
          <div className="max-w-sm">
            <FormField label="Recomp direction" htmlFor="nutrition-recomp-direction">
              <Select
                id="nutrition-recomp-direction"
                value={recompDirection}
                onChange={(e) =>
                  setRecompDirection(e.target.value as RecompDirection)
                }
              >
                <option value="slight-deficit">Slight deficit</option>
                <option value="slight-surplus">Slight surplus</option>
              </Select>
            </FormField>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <NutritionSummaryCard
          weightKg={safeWeightKg}
          bodyFatPercent={safeBodyFatPercent}
          fatFreeMassKg={results.fatFreeMassKg}
          fatFreeMassLbs={results.fatFreeMassLbs}
        />

        <ProteinRecommendationCard
          proteinFactor={results.proteinFactor}
          proteinTargetGrams={results.proteinTargetGrams}
        />

        <NutritionPlanCard
          calorieTarget={results.calorieTarget}
          fatPercent={results.fatPercent}
          proteinTargetGrams={results.proteinTargetGrams}
          fatTargetGrams={results.fatTargetGrams}
          carbsTargetGrams={results.carbsTargetGrams}
          proteinCalories={results.proteinCalories}
          fatCalories={results.fatCalories}
          carbCalories={results.carbCalories}
        />
      </div>
    </div>
  );
}