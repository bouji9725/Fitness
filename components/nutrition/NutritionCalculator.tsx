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
    <div className="grid gap-6">
      <Card className="grid gap-4">
        <div>
          <h2 className="text-2xl font-semibold ">
            Nutrition Plan Calculator
          </h2>
          <p className="mt-1 text-sm ">
            Calculate FFM, protein, calories, fats, and carbs based on your
            goal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Body Weight (kg)" htmlFor="weightKg">
            <Input
              id="weightKg"
              type="number"
              min={1}
              value={weightKg ?? ""}
              onChange={(e) => setWeightKg(parseNumberInput(e.target.value))}
            />
          </FormField>

          <FormField label="Body Fat (%)" htmlFor="bodyFatPercent">
            <Input
              id="bodyFatPercent"
              type="number"
              min={1}
              max={60}
              value={bodyFatPercent ?? ""}
              onChange={(e) =>
                setBodyFatPercent(parseNumberInput(e.target.value))
              }
            />
          </FormField>

          <FormField label="BMR (kcal)" htmlFor="bmr">
            <Input
              id="bmr"
              type="number"
              min={500}
              value={bmr ?? ""}
              onChange={(e) => setBmr(parseNumberInput(e.target.value))}
            />
          </FormField>

          <FormField label="Total Calories Burned / TDEE (kcal)" htmlFor="tdee">
            <Input
              id="tdee"
              type="number"
              min={500}
              value={tdee ?? ""}
              onChange={(e) => setTdee(parseNumberInput(e.target.value))}
            />
          </FormField>

          <FormField label="Nutrition Goal" htmlFor="goal">
            <Select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as NutritionGoal)}
            >
              <option value="lose-weight">Losing Weight</option>
              <option value="gain-muscle">Gaining Muscle</option>
              <option value="body-recomp">Body Recomposition</option>
            </Select>
          </FormField>

          <FormField label="Calorie Adjustment (kcal)" htmlFor="adjustment">
            <Input
              id="adjustment"
              type="number"
              min={200}
              max={1000}
              value={adjustment ?? ""}
              onChange={(e) => setAdjustment(parseNumberInput(e.target.value))}
            />
          </FormField>
        </div>

        {goal === "body-recomp" && (
          <div className="md:max-w-sm">
            <FormField label="Recomp Direction" htmlFor="recompDirection">
              <Select
                id="recompDirection"
                value={recompDirection}
                onChange={(e) =>
                  setRecompDirection(e.target.value as RecompDirection)
                }
              >
                <option value="slight-deficit">Slight Deficit</option>
                <option value="slight-surplus">Slight Surplus</option>
              </Select>
            </FormField>
          </div>
        )}
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
