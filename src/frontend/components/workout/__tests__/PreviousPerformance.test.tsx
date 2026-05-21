import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PreviousPerformance from "../PreviousPerformance";

describe("PreviousPerformance", () => {
  describe("empty state", () => {
    it("shows 'Personal best' label when no data", () => {
      render(<PreviousPerformance />);
      expect(screen.getByText("Personal best")).toBeInTheDocument();
    });

    it("shows no-data hint when reps and weight are undefined", () => {
      render(<PreviousPerformance />);
      expect(
        screen.getByText(/No previous data/i)
      ).toBeInTheDocument();
    });

    it("shows no-data hint when only reps is missing", () => {
      render(<PreviousPerformance weight={80} />);
      expect(screen.getByText(/No previous data/i)).toBeInTheDocument();
    });

    it("shows no-data hint when only weight is missing", () => {
      render(<PreviousPerformance reps={10} />);
      expect(screen.getByText(/No previous data/i)).toBeInTheDocument();
    });
  });

  describe("with data", () => {
    it("shows 'Personal best' label", () => {
      render(<PreviousPerformance weight={100} reps={8} />);
      expect(screen.getByText("Personal best")).toBeInTheDocument();
    });

    it("shows weight in kg", () => {
      render(<PreviousPerformance weight={100} reps={8} />);
      expect(screen.getByText(/100 kg/)).toBeInTheDocument();
    });

    it("shows reps", () => {
      render(<PreviousPerformance weight={100} reps={8} />);
      expect(screen.getByText(/× 8 reps/)).toBeInTheDocument();
    });

    it("shows progressive overload hint", () => {
      render(<PreviousPerformance weight={100} reps={8} />);
      expect(
        screen.getByText(/Beat this weight or reps/i)
      ).toBeInTheDocument();
    });
  });
});
