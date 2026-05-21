import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SetRow from "../SetRow";
import type { SetEntry } from "@shared/types/workout";

function makeSet(overrides?: Partial<SetEntry>): SetEntry {
  return { id: "set1", reps: 10, weight: 60, completed: false, ...overrides };
}

describe("SetRow", () => {
  describe("labels", () => {
    it("renders Reps label", () => {
      render(<SetRow exerciseId="ex1" set={makeSet()} dispatch={vi.fn()} />);
      expect(screen.getByText("Reps")).toBeInTheDocument();
    });

    it("renders Weight (kg) label", () => {
      render(<SetRow exerciseId="ex1" set={makeSet()} dispatch={vi.fn()} />);
      expect(screen.getByText("Weight (kg)")).toBeInTheDocument();
    });
  });

  describe("weight adjustment buttons", () => {
    it("renders −2 button", () => {
      render(<SetRow exerciseId="ex1" set={makeSet()} dispatch={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: "Decrease weight by 2 kg" })
      ).toBeInTheDocument();
    });

    it("renders +2 button", () => {
      render(<SetRow exerciseId="ex1" set={makeSet()} dispatch={vi.fn()} />);
      expect(
        screen.getByRole("button", { name: "Increase weight by 2 kg" })
      ).toBeInTheDocument();
    });

    it("clicking +2 dispatches UPDATE_SET_WEIGHT with weight+2", () => {
      const dispatch = vi.fn();
      render(<SetRow exerciseId="ex1" set={makeSet({ weight: 60 })} dispatch={dispatch} />);
      fireEvent.click(screen.getByRole("button", { name: "Increase weight by 2 kg" }));
      expect(dispatch).toHaveBeenCalledWith({
        type: "UPDATE_SET_WEIGHT",
        exerciseId: "ex1",
        setId: "set1",
        weight: 62,
      });
    });

    it("clicking −2 dispatches UPDATE_SET_WEIGHT with weight-2", () => {
      const dispatch = vi.fn();
      render(<SetRow exerciseId="ex1" set={makeSet({ weight: 60 })} dispatch={dispatch} />);
      fireEvent.click(screen.getByRole("button", { name: "Decrease weight by 2 kg" }));
      expect(dispatch).toHaveBeenCalledWith({
        type: "UPDATE_SET_WEIGHT",
        exerciseId: "ex1",
        setId: "set1",
        weight: 58,
      });
    });

    it("clicking −2 at 0 kg keeps weight at 0", () => {
      const dispatch = vi.fn();
      render(<SetRow exerciseId="ex1" set={makeSet({ weight: 0 })} dispatch={dispatch} />);
      fireEvent.click(screen.getByRole("button", { name: "Decrease weight by 2 kg" }));
      expect(dispatch).toHaveBeenCalledWith({
        type: "UPDATE_SET_WEIGHT",
        exerciseId: "ex1",
        setId: "set1",
        weight: 0,
      });
    });

    it("clicking −2 at 1 kg clamps to 0", () => {
      const dispatch = vi.fn();
      render(<SetRow exerciseId="ex1" set={makeSet({ weight: 1 })} dispatch={dispatch} />);
      fireEvent.click(screen.getByRole("button", { name: "Decrease weight by 2 kg" }));
      expect(dispatch).toHaveBeenCalledWith({
        type: "UPDATE_SET_WEIGHT",
        exerciseId: "ex1",
        setId: "set1",
        weight: 0,
      });
    });
  });

  describe("completed checkbox", () => {
    it("dispatches TOGGLE_SET_COMPLETED when checkbox changes", () => {
      const dispatch = vi.fn();
      render(<SetRow exerciseId="ex1" set={makeSet()} dispatch={dispatch} />);
      fireEvent.click(screen.getByRole("checkbox"));
      expect(dispatch).toHaveBeenCalledWith({
        type: "TOGGLE_SET_COMPLETED",
        exerciseId: "ex1",
        setId: "set1",
      });
    });

    it("checkbox reflects completed state", () => {
      render(<SetRow exerciseId="ex1" set={makeSet({ completed: true })} dispatch={vi.fn()} />);
      expect(screen.getByRole("checkbox")).toBeChecked();
    });
  });

  describe("set management buttons", () => {
    it("dispatches REMOVE_SET when Remove set clicked", () => {
      const dispatch = vi.fn();
      render(<SetRow exerciseId="ex1" set={makeSet()} dispatch={dispatch} />);
      fireEvent.click(screen.getByRole("button", { name: "Remove set" }));
      expect(dispatch).toHaveBeenCalledWith({
        type: "REMOVE_SET",
        exerciseId: "ex1",
        setId: "set1",
      });
    });

    it("dispatches ADD_SET when Add set clicked", () => {
      const dispatch = vi.fn();
      render(<SetRow exerciseId="ex1" set={makeSet()} dispatch={dispatch} />);
      fireEvent.click(screen.getByRole("button", { name: "Add set" }));
      expect(dispatch).toHaveBeenCalledWith({
        type: "ADD_SET",
        exerciseId: "ex1",
      });
    });
  });
});
