"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import { calculateNutritionResults } from "@/lib/nutrition-calculations";
import NutritionSummaryCard from "./NutritionSummaryCard";
import ProteinRecommendationCard from "./ProteinRecommendationCard";
import NutritionPlanCard from "./NutritionPlanCard";
import type { NutritionGoal, RecompDirection } from "@/types/nutrition";
import { saveNutritionSummary } from "@/lib/profile-storage";

export default function NutritionCalculator() {
  const [weightKg, setWeightKg] = useState(80);
  const [bodyFatPercent, setBodyFatPercent] = useState(15);
  const [bmr, setBmr] = useState(1800);
  const [tdee, setTdee] = useState(2600);
  const [goal, setGoal] = useState<NutritionGoal>("gain-muscle");
  const [adjustment, setAdjustment] = useState(500);
  const [recompDirection, setRecompDirection] =
    useState<RecompDirection>("slight-deficit");

  const results = useMemo(() => {
    return calculateNutritionResults({
      weightKg,
      bodyFatPercent,
      bmr,
      tdee,
      goal,
      adjustment,
      recompDirection,
    });
  }, [weightKg, bodyFatPercent, bmr, tdee, goal, adjustment, recompDirection]);
useEffect(() => {
  saveNutritionSummary(results);
}, [results]);
  return (
    <div className="grid gap-6">
      <Card className="grid gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Nutrition Plan Calculator
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Calculate FFM, protein, calories, fats, and carbs based on your goal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="weightKg" className="text-sm font-medium text-slate-700">
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

          <div className="grid gap-2">
            <label htmlFor="bmr" className="text-sm font-medium text-slate-700">
              BMR (kcal)
            </label>
            <input
              id="bmr"
              type="number"
              min={500}
              value={bmr}
              onChange={(e) => setBmr(Number(e.target.value))}
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="tdee" className="text-sm font-medium text-slate-700">
              Total Calories Burned / TDEE (kcal)
            </label>
            <input
              id="tdee"
              type="number"
              min={500}
              value={tdee}
              onChange={(e) => setTdee(Number(e.target.value))}
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="goal" className="text-sm font-medium text-slate-700">
              Nutrition Goal
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as NutritionGoal)}
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            >
              <option value="lose-weight">Losing Weight</option>
              <option value="gain-muscle">Gaining Muscle</option>
              <option value="body-recomp">Body Recomposition</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="adjustment"
              className="text-sm font-medium text-slate-700"
            >
              Calorie Adjustment (kcal)
            </label>
            <input
              id="adjustment"
              type="number"
              min={200}
              max={1000}
              value={adjustment}
              onChange={(e) => setAdjustment(Number(e.target.value))}
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            />
          </div>
        </div>

        {goal === "body-recomp" && (
          <div className="grid gap-2 md:max-w-sm">
            <label
              htmlFor="recompDirection"
              className="text-sm font-medium text-slate-700"
            >
              Recomp Direction
            </label>
            <select
              id="recompDirection"
              value={recompDirection}
              onChange={(e) =>
                setRecompDirection(e.target.value as RecompDirection)
              }
              className="min-h-11 rounded-xl border border-slate-200 px-3"
            >
              <option value="slight-deficit">Slight Deficit</option>
              <option value="slight-surplus">Slight Surplus</option>
            </select>
          </div>
        )}
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
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