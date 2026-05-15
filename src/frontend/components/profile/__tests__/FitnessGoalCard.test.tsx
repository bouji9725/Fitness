import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import FitnessGoalCard from "../FitnessGoalCard";

describe("FitnessGoalCard", () => {
  it("shows empty state when goal is undefined", () => {
    render(<FitnessGoalCard goal={undefined} onEdit={vi.fn()} />);
    expect(
      screen.getByText(/No goal set/)
    ).toBeInTheDocument();
  });

  it("shows 'Gain Muscle' label for gain-muscle goal", () => {
    render(<FitnessGoalCard goal="gain-muscle" onEdit={vi.fn()} />);
    expect(screen.getByText("Gain Muscle")).toBeInTheDocument();
  });

  it("shows 'Lose Weight' label for lose-weight goal", () => {
    render(<FitnessGoalCard goal="lose-weight" onEdit={vi.fn()} />);
    expect(screen.getByText("Lose Weight")).toBeInTheDocument();
  });

  it("shows 'Body Recomposition' label for body-recomp goal", () => {
    render(<FitnessGoalCard goal="body-recomp" onEdit={vi.fn()} />);
    expect(screen.getByText("Body Recomposition")).toBeInTheDocument();
  });

  it("shows 'Maintenance' label for maintenance goal", () => {
    render(<FitnessGoalCard goal="maintenance" onEdit={vi.fn()} />);
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  it("shows description text for each goal", () => {
    render(<FitnessGoalCard goal="gain-muscle" onEdit={vi.fn()} />);
    expect(
      screen.getByText(/Targeting a calorie surplus/)
    ).toBeInTheDocument();
  });

  it("calls onEdit when Edit button is clicked", async () => {
    const onEdit = vi.fn();
    render(<FitnessGoalCard goal="maintenance" onEdit={onEdit} />);
    await userEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onEdit).toHaveBeenCalledOnce();
  });
});
