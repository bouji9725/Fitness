import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ShareReadinessCard from "../ShareReadinessCard";
import type { UserProfile } from "@shared/types/profile";
import type { BodyStatsEntry } from "@shared/types/progress";
import type { NutritionResults } from "@shared/types/nutrition";
import type { WorkoutSessionRecord } from "@shared/types/workout";

const fullProfile: UserProfile = {
  id: "u1",
  name: "Alice",
  age: 28,
  heightCm: 168,
  sex: "female",
  goal: "gain-muscle",
  coachSharingEnabled: true,
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

describe("ShareReadinessCard", () => {
  it("shows 0/5 when no data is present", () => {
    render(
      <ShareReadinessCard
        profile={null}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(screen.getByText("0/5")).toBeInTheDocument();
  });

  it("shows 5/5 when all items are ready", () => {
    render(
      <ShareReadinessCard
        profile={fullProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
        savedWorkouts={[workoutRecord]}
      />
    );
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });

  it("increments count as each condition is met", () => {
    // profile complete (name+age+sex+height) + goal set + coach sharing enabled = 3 items
    render(
      <ShareReadinessCard
        profile={fullProfile}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(screen.getByText("3/5")).toBeInTheDocument();
  });

  it("renders all 5 checklist item labels", () => {
    render(
      <ShareReadinessCard
        profile={null}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(
      screen.getByText("Profile complete (name, age, sex, height)")
    ).toBeInTheDocument();
    expect(screen.getByText("Fitness goal set")).toBeInTheDocument();
    expect(screen.getByText("Body stats recorded")).toBeInTheDocument();
    expect(screen.getByText("Nutrition plan calculated")).toBeInTheDocument();
    expect(screen.getByText("Coach sharing enabled")).toBeInTheDocument();
  });

  it("shows all-ready message when 5/5 complete", () => {
    render(
      <ShareReadinessCard
        profile={fullProfile}
        latestBodyStats={bodyStats}
        nutritionSummary={nutrition}
        savedWorkouts={[workoutRecord]}
      />
    );
    expect(
      screen.getByText(/Your report is ready to share/)
    ).toBeInTheDocument();
  });

  it("does not show ready message when incomplete", () => {
    render(
      <ShareReadinessCard
        profile={null}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(
      screen.queryByText(/Your report is ready to share/)
    ).not.toBeInTheDocument();
  });

  it("shows Fix links for incomplete items", () => {
    render(
      <ShareReadinessCard
        profile={null}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    const fixLinks = screen.getAllByRole("link", { name: "Fix →" });
    expect(fixLinks.length).toBe(5);
  });

  it("requires both name AND age AND sex AND height for profile item", () => {
    // Profile with name but missing age/sex/height — still incomplete
    render(
      <ShareReadinessCard
        profile={{ id: "u1", name: "Bob", coachSharingEnabled: false }}
        latestBodyStats={null}
        nutritionSummary={null}
        savedWorkouts={[]}
      />
    );
    expect(screen.getByText("0/5")).toBeInTheDocument();
  });
});
