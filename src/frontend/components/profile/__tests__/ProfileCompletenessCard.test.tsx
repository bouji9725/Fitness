import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProfileCompletenessCard from "../ProfileCompletenessCard";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";

const emptyProfile: UserProfile = {
  id: "u1",
  name: "",
  coachSharingEnabled: false,
};

const fullProfile: UserProfile = {
  id: "u1",
  name: "Alice",
  age: 28,
  heightCm: 168,
  sex: "female",
  goal: "gain-muscle",
  coachSharingEnabled: false,
};

const bodyStats: BodyStatsEntry = {
  id: "bs1",
  date: "2026-05-15",
  weightKg: 60,
  bodyFatPercent: 22,
};

const nutrition: NutritionResults = {
  fatFreeMassKg: 46.8,
  fatFreeMassLbs: 103.2,
  proteinFactor: 1.8,
  proteinTargetGrams: 84,
  calorieTarget: 2100,
  fatPercent: 25,
  fatTargetGrams: 58,
  carbsTargetGrams: 246,
  proteinCalories: 336,
  fatCalories: 525,
  carbCalories: 984,
};

describe("ProfileCompletenessCard", () => {
  it("shows 0% when no fields are filled", () => {
    render(
      <ProfileCompletenessCard
        profile={emptyProfile}
        latestBodyStats={null}
        nutritionSummary={null}
      />
    );
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("shows 100% when all fields are complete", () => {
    render(
      <ProfileCompletenessCard
        profile={fullProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
      />
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("shows 0/6 done count when nothing is complete", () => {
    render(
      <ProfileCompletenessCard
        profile={emptyProfile}
        latestBodyStats={null}
        nutritionSummary={null}
      />
    );
    expect(screen.getByText("0/6 done")).toBeInTheDocument();
  });

  it("shows 6/6 done count when everything is complete", () => {
    render(
      <ProfileCompletenessCard
        profile={fullProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
      />
    );
    expect(screen.getByText("6/6 done")).toBeInTheDocument();
  });

  it("shows 'all complete' message when 100%", () => {
    render(
      <ProfileCompletenessCard
        profile={fullProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
      />
    );
    expect(
      screen.getByText(/All fields complete/)
    ).toBeInTheDocument();
  });

  it("shows missing field chips when incomplete", () => {
    render(
      <ProfileCompletenessCard
        profile={emptyProfile}
        latestBodyStats={null}
        nutritionSummary={null}
      />
    );
    expect(screen.getByText(/Missing: Name/)).toBeInTheDocument();
    expect(screen.getByText(/Missing: Age/)).toBeInTheDocument();
    expect(screen.getByText(/Missing: Nutrition plan/)).toBeInTheDocument();
  });

  it("does not show missing chips when all complete", () => {
    render(
      <ProfileCompletenessCard
        profile={fullProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
      />
    );
    expect(screen.queryByText(/Missing:/)).not.toBeInTheDocument();
  });

  it("counts sex & height as one item requiring both to be set", () => {
    // Only sex set, not height — should still be missing
    render(
      <ProfileCompletenessCard
        profile={{ ...emptyProfile, sex: "female" }}
        latestBodyStats={null}
        nutritionSummary={null}
      />
    );
    expect(screen.getByText(/Missing: Sex & height/)).toBeInTheDocument();
  });
});
