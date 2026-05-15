import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SetupChecklistCard from "../SetupChecklistCard";

describe("SetupChecklistCard", () => {
  const allFalse = {
    hasProfile: false,
    hasProgressEntry: false,
    hasNutritionPlan: false,
    hasWorkout: false,
    hasSharingEnabled: false,
  };

  it("renders 'Getting started' heading when incomplete", () => {
    render(<SetupChecklistCard {...allFalse} />);
    expect(screen.getByText("Getting started")).toBeInTheDocument();
  });

  it("renders 'You're all set' heading when all items done", () => {
    render(
      <SetupChecklistCard
        hasProfile
        hasProgressEntry
        hasNutritionPlan
        hasWorkout
        hasSharingEnabled
      />
    );
    expect(screen.getByText("You're all set")).toBeInTheDocument();
  });

  it("renders the done count numerator", () => {
    render(<SetupChecklistCard {...allFalse} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("increments numerator per completed item", () => {
    render(<SetupChecklistCard {...allFalse} hasProfile hasProgressEntry />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders all 5 item labels", () => {
    render(<SetupChecklistCard {...allFalse} />);
    expect(screen.getByText("Complete your profile")).toBeInTheDocument();
    expect(screen.getByText("Add a progress entry")).toBeInTheDocument();
    expect(screen.getByText("Calculate nutrition plan")).toBeInTheDocument();
    expect(screen.getByText("Complete a workout")).toBeInTheDocument();
    expect(screen.getByText("Enable coach sharing")).toBeInTheDocument();
  });

  it("does not render 'Getting started' when all done", () => {
    render(
      <SetupChecklistCard
        hasProfile
        hasProgressEntry
        hasNutritionPlan
        hasWorkout
        hasSharingEnabled
      />
    );
    expect(screen.queryByText("Getting started")).not.toBeInTheDocument();
  });
});
