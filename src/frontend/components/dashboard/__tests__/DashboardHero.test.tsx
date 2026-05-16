import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardHero from "../DashboardHero";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";

const profile: UserProfile = {
  id: "u1",
  name: "Alice",
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

const workout: WorkoutSessionRecord = {
  session: {
    id: "s1",
    templateId: "push-day",
    templateName: "Push Day",
    performedAt: "2026-05-10T10:00:00Z",
    status: "completed",
    exercises: [],
    createdAt: "2026-05-10T10:00:00Z",
    updatedAt: "2026-05-10T10:00:00Z",
  },
  savedAt: "2026-05-10T10:05:00Z",
};

describe("DashboardHero", () => {
  it("shows personalized greeting when profile has name", () => {
    render(
      <DashboardHero
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkout={null}
      />
    );
    expect(screen.getByText("Welcome back, Alice")).toBeInTheDocument();
  });

  it("shows generic greeting when profile has no name", () => {
    render(
      <DashboardHero
        profile={{ ...profile, name: "" }}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkout={null}
      />
    );
    expect(screen.getByText("Welcome to Fitsler")).toBeInTheDocument();
  });

  it("shows profile setup prompt when no snippets available", () => {
    render(
      <DashboardHero
        profile={{ ...profile, goal: undefined, name: "" }}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkout={null}
      />
    );
    expect(
      screen.getByText(/Complete your profile to see personalized insights/)
    ).toBeInTheDocument();
  });

  it("shows goal snippet when profile has goal", () => {
    render(
      <DashboardHero
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkout={null}
      />
    );
    expect(screen.getByText("Gain muscle")).toBeInTheDocument();
  });

  it("shows weight snippet from body stats", () => {
    render(
      <DashboardHero
        profile={profile}
        latestBodyStats={bodyStats}
        nutritionSummary={null}
        recentWorkout={null}
      />
    );
    expect(screen.getByText("60 kg")).toBeInTheDocument();
  });

  it("shows calorie target snippet from nutrition", () => {
    render(
      <DashboardHero
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={nutrition}
        recentWorkout={null}
      />
    );
    expect(screen.getByText("2100 kcal")).toBeInTheDocument();
  });

  it("shows last workout snippet from recent workout", () => {
    render(
      <DashboardHero
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkout={workout}
      />
    );
    expect(screen.getByText("Push Day")).toBeInTheDocument();
  });

  it("shows null profile as generic greeting", () => {
    render(
      <DashboardHero
        profile={null}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkout={null}
      />
    );
    expect(screen.getByText("Welcome to Fitsler")).toBeInTheDocument();
  });
});
