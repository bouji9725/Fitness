import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardMetricGrid from "../DashboardMetricGrid";
import type { NutritionResults } from "@shared/types/nutrition";
import type { BodyStatsEntry } from "@shared/types/progress";

const nutrition: NutritionResults = {
  fatFreeMassKg: 46.8,
  fatFreeMassLbs: 103.2,
  proteinFactor: 1.8,
  proteinTargetGrams: 124,
  calorieTarget: 2800,
  fatPercent: 25,
  fatTargetGrams: 78,
  carbsTargetGrams: 326,
  proteinCalories: 496,
  fatCalories: 700,
  carbCalories: 1304,
};

const bodyStats: BodyStatsEntry = {
  id: "bs1",
  date: "2026-05-15",
  weightKg: 82,
  bodyFatPercent: 16,
};

describe("DashboardMetricGrid", () => {
  it("shows em-dash placeholders when no data", () => {
    render(
      <DashboardMetricGrid
        nutritionSummary={null}
        latestBodyStats={null}
        savedWorkoutsCount={0}
        lastTrainingDay={null}
      />
    );
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it("shows calorie target when nutrition is available", () => {
    render(
      <DashboardMetricGrid
        nutritionSummary={nutrition}
        latestBodyStats={null}
        savedWorkoutsCount={0}
        lastTrainingDay={null}
      />
    );
    expect(screen.getByText("2800 kcal")).toBeInTheDocument();
  });

  it("shows weight and body fat when body stats are available", () => {
    render(
      <DashboardMetricGrid
        nutritionSummary={null}
        latestBodyStats={bodyStats}
        savedWorkoutsCount={0}
        lastTrainingDay={null}
      />
    );
    expect(screen.getByText("82 kg")).toBeInTheDocument();
    expect(screen.getByText("Body fat: 16%")).toBeInTheDocument();
  });

  it("shows saved workouts count", () => {
    render(
      <DashboardMetricGrid
        nutritionSummary={null}
        latestBodyStats={null}
        savedWorkoutsCount={7}
        lastTrainingDay={null}
      />
    );
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("shows last training day when provided", () => {
    render(
      <DashboardMetricGrid
        nutritionSummary={null}
        latestBodyStats={null}
        savedWorkoutsCount={3}
        lastTrainingDay="2026-05-10T10:00:00Z"
      />
    );
    expect(screen.getByText(/Last session:/)).toBeInTheDocument();
  });
});
