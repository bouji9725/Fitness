"use client";

import Link from "next/link";
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
import { useToast } from "@frontend/context/ToastContext";
import NutritionSummaryCard from "./NutritionSummaryCard";
import ProteinRecommendationCard from "./ProteinRecommendationCard";
import NutritionPlanCard from "./NutritionPlanCard";
import type { NutritionGoal, RecompDirection } from "@shared/types/nutrition";

// Activity level → TDEE multiplier mapping
const ACTIVITY_LEVELS = [
  { value: "1.2", label: "Sedentary — desk job, little exercise" },
  { value: "1.375", label: "Lightly active — 1–3 workouts per week" },
  { value: "1.55", label: "Active — 3–5 workouts per week" },
  { value: "1.725", label: "Very active — 6–7 workouts per week" },
] as const;

// Calorie adjustment presets
const ADJUSTMENT_MAP = {
  conservative: 250,
  normal: 500,
  aggressive: 750,
} as const;

type AdjustmentPreset = keyof typeof ADJUSTMENT_MAP;

type ProfileHints = {
  sex?: "male" | "female";
  age?: number;
  heightCm?: number;
};

export default function NutritionCalculator() {
  // ── Body data ───────────────────────────────────────────────────────
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [bodyFatPercent, setBodyFatPercent] = useState<number | "">("");
  const [bmr, setBmr] = useState<number | "">("");
  const [profileHints, setProfileHints] = useState<ProfileHints | null>(null);

  // ── Goal & activity ─────────────────────────────────────────────────
  const [goal, setGoal] = useState<NutritionGoal>("gain-muscle");
  const [activityMultiplier, setActivityMultiplier] = useState<number>(1.375);
  const [adjustmentPreset, setAdjustmentPreset] =
    useState<AdjustmentPreset>("normal");
  const [recompDirection, setRecompDirection] =
    useState<RecompDirection>("slight-deficit");

  // ── UI state ────────────────────────────────────────────────────────
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const { toast } = useToast();

  // Pre-fill all body inputs from profile + latest progress entry on mount.
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

      const hints: ProfileHints = {};
      if (profile.sex) hints.sex = profile.sex;
      if (profile.age) hints.age = profile.age;
      if (profile.heightCm) hints.heightCm = profile.heightCm;
      setProfileHints(hints);

      if (profile.sex && profile.age && profile.heightCm) {
        const weightForBmr = latest?.weightKg ?? 80;
        const computedBmr = calculateMifflinStJeorBMR(
          weightForBmr,
          profile.heightCm,
          profile.age,
          profile.sex
        );
        setBmr(computedBmr);
      }
    }

    prefill().catch(() => {
      // Fail silently — user can fill fields manually.
    });
  }, []);

  // ── Safe numeric values ─────────────────────────────────────────────
  const safeWeightKg = typeof weightKg === "number" ? weightKg : 0;
  const safeBodyFatPercent =
    typeof bodyFatPercent === "number" ? bodyFatPercent : 0;
  const safeBmr = typeof bmr === "number" ? bmr : 0;
  const safeAdjustment =
    goal === "maintenance" ? 0 : ADJUSTMENT_MAP[adjustmentPreset];

  // TDEE is derived — not a separate state.
  const results = useMemo(() => {
    const tdee =
      safeBmr > 0 ? Math.round(safeBmr * activityMultiplier) : 0;

    return calculateNutritionResults({
      weightKg: safeWeightKg,
      bodyFatPercent: safeBodyFatPercent,
      bmr: safeBmr,
      tdee,
      goal,
      adjustment: safeAdjustment,
      recompDirection,
    });
  }, [
    safeWeightKg,
    safeBodyFatPercent,
    safeBmr,
    activityMultiplier,
    goal,
    safeAdjustment,
    recompDirection,
  ]);

  const computedTdee =
    safeBmr > 0 ? Math.round(safeBmr * activityMultiplier) : 0;

  // Auto-save whenever results change — only when the user has entered real data.
  useEffect(() => {
    if (safeWeightKg === 0 && safeBmr === 0) return;

    let cancelled = false;

    async function persist() {
      try {
        await saveNutritionSummaryApi(results);
        if (!cancelled) toast("Nutrition plan saved", "success");
      } catch {
        if (!cancelled) toast("Could not save plan — try again", "error");
      }
    }

    persist();

    return () => {
      cancelled = true;
    };
  }, [results, toast]);

  const showIntensity = goal !== "maintenance";

  return (
    <div className="space-y-6">
      {/* ── Step 1: Body data ─────────────────────────────────────── */}
      <Card className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Step 1
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Your body data
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Pulled from your latest progress entry. Adjust if needed before calculating.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Weight (kg)" htmlFor="nutr-weight">
            <Input
              id="nutr-weight"
              type="number"
              value={weightKg}
              onChange={(e) =>
                setWeightKg(parseNumberInput(e.target.value) ?? "")
              }
              placeholder="e.g. 80"
            />
          </FormField>

          <FormField label="Body fat (%)" htmlFor="nutr-bf">
            <Input
              id="nutr-bf"
              type="number"
              value={bodyFatPercent}
              onChange={(e) =>
                setBodyFatPercent(parseNumberInput(e.target.value) ?? "")
              }
              placeholder="e.g. 18"
            />
          </FormField>
        </div>

        {/* Profile data hint */}
        {profileHints && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <p className="font-medium text-slate-200">
              From your profile:{" "}
              {[
                profileHints.sex
                  ? profileHints.sex.charAt(0).toUpperCase() +
                    profileHints.sex.slice(1)
                  : null,
                profileHints.age ? `${profileHints.age} yrs` : null,
                profileHints.heightCm
                  ? `${profileHints.heightCm} cm`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ") || "No profile data yet"}
            </p>
            <p className="mt-1 text-slate-400">
              These are used to calculate your BMR.{" "}
              <Link
                href="/profile"
                className="text-indigo-400 underline-offset-2 hover:underline"
              >
                Update profile →
              </Link>
            </p>
          </div>
        )}
      </Card>

      {/* ── Step 2: Goal & activity ───────────────────────────────── */}
      <Card className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Step 2
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Goal &amp; activity
          </h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Choose your fitness goal and how active you are. These determine your calorie target.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FormField label="Fitness goal" htmlFor="nutr-goal">
            <Select
              id="nutr-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value as NutritionGoal)}
            >
              <option value="lose-weight">Lose weight</option>
              <option value="gain-muscle">Gain muscle</option>
              <option value="body-recomp">Body recomposition</option>
              <option value="maintenance">Maintenance</option>
            </Select>
          </FormField>

          <FormField label="Activity level" htmlFor="nutr-activity">
            <Select
              id="nutr-activity"
              value={String(activityMultiplier)}
              onChange={(e) =>
                setActivityMultiplier(parseFloat(e.target.value))
              }
            >
              {ACTIVITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </Select>
          </FormField>

          {showIntensity && (
            <FormField label="Intensity" htmlFor="nutr-intensity">
              <Select
                id="nutr-intensity"
                value={adjustmentPreset}
                onChange={(e) =>
                  setAdjustmentPreset(e.target.value as AdjustmentPreset)
                }
              >
                <option value="conservative">
                  Conservative (±250 kcal)
                </option>
                <option value="normal">Normal (±500 kcal)</option>
                <option value="aggressive">Aggressive (±750 kcal)</option>
              </Select>
            </FormField>
          )}

          {goal === "body-recomp" && (
            <FormField label="Recomp direction" htmlFor="nutr-recomp">
              <Select
                id="nutr-recomp"
                value={recompDirection}
                onChange={(e) =>
                  setRecompDirection(e.target.value as RecompDirection)
                }
              >
                <option value="slight-deficit">Slight deficit</option>
                <option value="slight-surplus">Slight surplus</option>
              </Select>
            </FormField>
          )}
        </div>
      </Card>

      {/* ── Step 3: Nutrition plan ────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
            Step 3
          </p>
          <p className="text-xs text-slate-400">Your nutrition plan</p>
        </div>

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

      {/* ── Advanced details (collapsible) ───────────────────────── */}
      <Card className="space-y-4">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen((prev) => !prev)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Advanced
            </p>
            <p className="mt-1 text-sm font-medium text-white">
              Metabolism details
            </p>
          </div>
          <svg
            className={[
              "h-5 w-5 text-slate-400 transition-transform",
              isAdvancedOpen ? "rotate-180" : "",
            ].join(" ")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isAdvancedOpen && (
          <div className="space-y-4 border-t border-white/10 pt-4">
            <p className="text-sm leading-6 text-slate-300">
              BMR is auto-calculated using the Mifflin-St Jeor formula from
              your profile data. TDEE = BMR × activity multiplier. You can
              override BMR here if needed.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="BMR — override (kcal)"
                htmlFor="nutr-bmr"
              >
                <Input
                  id="nutr-bmr"
                  type="number"
                  value={bmr}
                  onChange={(e) =>
                    setBmr(parseNumberInput(e.target.value) ?? "")
                  }
                  placeholder="Auto-calculated"
                />
              </FormField>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-400">
                  TDEE (computed)
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {computedTdee > 0 ? `${computedTdee} kcal` : "—"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  BMR × {activityMultiplier}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
