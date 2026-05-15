import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CoachReportPreview from "../CoachReportPreview";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";

const profile: UserProfile = {
  id: "u1",
  name: "Alice",
  age: 28,
  heightCm: 168,
  sex: "female",
  goal: "gain-muscle",
  coachSharingEnabled: true,
  coachName: "Coach Sarah",
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
    status: "saved",
    exercises: [],
    createdAt: "2026-05-10T10:00:00Z",
    updatedAt: "2026-05-10T10:00:00Z",
  },
  savedAt: "2026-05-10T10:05:00Z",
};

describe("CoachReportPreview", () => {
  it("shows coach name in subtitle when provided", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    expect(screen.getByText(/Prepared for Coach Sarah/)).toBeInTheDocument();
  });

  it("shows 'No coach name set' when coachName is absent", () => {
    render(
      <CoachReportPreview
        profile={{ ...profile, coachName: undefined }}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    expect(screen.getByText(/No coach name set/)).toBeInTheDocument();
  });

  it("renders profile summary rows", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();
    expect(screen.getByText("168 cm")).toBeInTheDocument();
    expect(screen.getByText("Gain Muscle")).toBeInTheDocument();
  });

  it("renders body stats when available", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={bodyStats}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    expect(screen.getByText("60 kg")).toBeInTheDocument();
    expect(screen.getByText("22%")).toBeInTheDocument();
  });

  it("shows 'No body stats recorded' when bodyStats is null", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    expect(screen.getByText("No body stats recorded.")).toBeInTheDocument();
  });

  it("renders nutrition macros when available", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={nutrition}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    expect(screen.getByText("2100 kcal")).toBeInTheDocument();
    expect(screen.getByText("84 g")).toBeInTheDocument();
  });

  it("shows 'No nutrition plan saved' when summary is null", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    expect(screen.getByText("No nutrition plan saved.")).toBeInTheDocument();
  });

  it("renders recent workout template names", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[workout]}
        totalWorkouts={3}
      />
    );
    expect(screen.getByText("Push Day")).toBeInTheDocument();
  });

  it("shows total workouts count in section header", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={12}
      />
    );
    expect(screen.getByText(/12 total/)).toBeInTheDocument();
  });

  it("shows empty workout message when no sessions", () => {
    render(
      <CoachReportPreview
        profile={profile}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    expect(
      screen.getByText("No saved workout sessions yet.")
    ).toBeInTheDocument();
  });

  it("handles null profile gracefully — shows multiple Not set rows", () => {
    render(
      <CoachReportPreview
        profile={null}
        latestBodyStats={null}
        nutritionSummary={null}
        recentWorkouts={[]}
        totalWorkouts={0}
      />
    );
    // Name, Age, Height, Goal all fall back to "Not set"
    const notSetCells = screen.getAllByText("Not set");
    expect(notSetCells.length).toBeGreaterThanOrEqual(4);
  });
});
