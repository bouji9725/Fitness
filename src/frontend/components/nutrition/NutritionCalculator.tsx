"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@frontend/components/ui/Card";
import Input from "@frontend/components/ui/Input";
import Select from "@frontend/components/ui/Select";
import FormField from "@frontend/components/ui/FormField";
import {
  calculateNutritionResults,
  calculateMifflinStJeorBMR,
} from "@shared/calculations/nutrition";
import { getLatestBodyStats } from "@shared/calculations/progress";
import { saveNutritionSummaryApi } from "@frontend/api/nutrition-api";
import { getProfile } from "@frontend/api/profile-api";
import { listProgressEntries } from "@frontend/api/progress-api";
import { parseNumberInput } from "@shared/utils/number";
import NutritionSummaryCard from "./NutritionSummaryCard";
import ProteinRecommendationCard from "./ProteinRecommendationCard";
import NutritionPlanCard from "./NutritionPlanCard";
import type { NutritionGoal, RecompDirection } from "@shared/types/nutrition";

export default function NutritionCalculator() {
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [bodyFatPercent, setBodyFatPercent] = useState<number | "">("");
  const [bmr, setBmr] = useState<number | "">("");
  const [tdee, setTdee] = useState<number | "">("");
  const [goal, setGoal] = useState<NutritionGoal>("gain-muscle");
  const [adjustment, setAdjustment] = useState<number | "">("");
  const [recompDirection, setRecompDirection] =
    useState<RecompDirection>("slight-deficit");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Pre-fill all inputs from profile + latest progress entry on mount.
  useEffect(() => {
    async function prefill() {
      const [profile, entries] = await Promise.all([
        getProfile(),
        listProgressEntries(),
      ]);

      const latest = getLatestBodyStats(entries);

      if (latest?.weightKg) setWeightKg(latest.weightKg);
      if (latest?.bodyFatPercent) setBodyFatPercent(latest.bodyFatPercent);
      if (profile.goal) setGoal(profile.goal);

      if (profile.sex && profile.age && profile.heightCm) {
        const weightForBmr = latest?.weightKg ?? 80;
        const computedBmr = calculateMifflinStJeorBMR(
          weightForBmr,
          profile.heightCm,
          profile.age,
          profile.sex
        );
        setBmr(computedBmr);
        setTdee(Math.round(computedBmr * 1.375));
      }
    }

    prefill().catch(() => {
      // Fail silently — user can fill fields manually.
    });
  }, []);

  const safeWeightKg = typeof weightKg === "number" ? weightKg : 0;
  const safeBodyFatPercent = typeof bodyFatPercent === "number" ? bodyFatPercent : 0;
  const safeBmr = typeof bmr === "number" ? bmr : 0;
  const safeTdee = typeof tdee === "number" ? tdee : 0;
  const safeAdjustment = typeof adjustment === "number" ? adjustment : 0;

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
    let cancelled = false;

    async function persistNutritionSummary() {
      try {
        setSaveStatus("saving");
        await saveNutritionSummaryApi(results);
        if (!cancelled) setSaveStatus("saved");
      } catch {
        if (!cancelled) setSaveStatus("error");
      }
    }

    persistNutritionSummary();

    return () => {
      cancelled = true;
    };
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
            Estimate fat-free mass, calories, protein, fats, and carbs based on
            your goal. Fields are pre-filled from your profile and latest progress
            entry — adjust as needed.
          </p>

          <p className="mt-3 text-sm text-slate-400">
            {saveStatus === "saving" && "Saving nutrition summary..."}
            {saveStatus === "saved" && "Nutrition summary saved."}
            {saveStatus === "error" && "Nutrition summary could not be saved."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FormField label="Weight (kg)" htmlFor="nutrition-weight">
            <Input
              id="nutrition-weight"
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(parseNumberInput(e.target.value) ?? "")}
            />
          </FormField>

          <FormField label="Body fat (%)" htmlFor="nutrition-body-fat">
            <Input
              id="nutrition-body-fat"
              type="number"
              value={bodyFatPercent}
              onChange={(e) =>
                setBodyFatPercent(parseNumberInput(e.target.value) ?? "")
              }
            />
          </FormField>

          <FormField label="BMR (auto-calculated)" htmlFor="nutrition-bmr">
            <Input
              id="nutrition-bmr"
              type="number"
              value={bmr}
              onChange={(e) => setBmr(parseNumberInput(e.target.value) ?? "")}
            />
          </FormField>

          <FormField label="TDEE (auto-calculated)" htmlFor="nutrition-tdee">
            <Input
              id="nutrition-tdee"
              type="number"
              value={tdee}
              onChange={(e) => setTdee(parseNumberInput(e.target.value) ?? "")}
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
              <option value="maintenance">Maintenance</option>
            </Select>
          </FormField>

          <FormField label="Adjustment (kcal)" htmlFor="nutrition-adjustment">
            <Input
              id="nutrition-adjustment"
              type="number"
              value={adjustment}
              onChange={(e) => setAdjustment(parseNumberInput(e.target.value) ?? "")}
            />
          </FormField>
        </div>

        {goal === "body-recomp" ? (
          <div className="max-w-sm">
            <FormField
              label="Recomp direction"
              htmlFor="nutrition-recomp-direction"
            >
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
