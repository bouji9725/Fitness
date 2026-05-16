import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NextActionCard from "../NextActionCard";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";

const baseProfile: UserProfile = {
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

const workoutRecord: WorkoutSessionRecord = {
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

describe("NextActionCard — deriveNextAction logic", () => {
  it("prompts to complete profile when name is missing", () => {
    render(
      <NextActionCard
        profile={{ ...baseProfile, name: "" }}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(screen.getByText("Complete your profile")).toBeInTheDocument();
  });

  it("prompts to complete profile when age is missing", () => {
    render(
      <NextActionCard
        profile={{ ...baseProfile, age: undefined }}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(screen.getByText("Complete your profile")).toBeInTheDocument();
  });

  it("prompts to add body stats when profile complete but no progress entry", () => {
    render(
      <NextActionCard
        profile={baseProfile}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(screen.getByText("Add your first body stats")).toBeInTheDocument();
  });

  it("prompts to calculate nutrition when no nutrition plan", () => {
    render(
      <NextActionCard
        profile={baseProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(screen.getByText("Calculate your nutrition plan")).toBeInTheDocument();
  });

  it("prompts to log first workout when no sessions saved", () => {
    render(
      <NextActionCard
        profile={baseProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
        savedWorkouts={[]}
      />
    );
    expect(screen.getByText("Log your first workout")).toBeInTheDocument();
  });

  it("shows keep tracking when everything is complete", () => {
    render(
      <NextActionCard
        profile={baseProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
        savedWorkouts={[workoutRecord]}
      />
    );
    expect(screen.getByText("Keep tracking")).toBeInTheDocument();
  });

  it("renders the action button with correct label", () => {
    render(
      <NextActionCard
        profile={baseProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
        savedWorkouts={[workoutRecord]}
      />
    );
    expect(screen.getByRole("link", { name: "View progress" })).toBeInTheDocument();
  });
});
