import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SaveWorkoutBar from "../SaveWorkoutBar";

const noop = () => {};

describe("SaveWorkoutBar", () => {
  describe("button label", () => {
    it("shows 'Save workout' when not all complete", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={true}
          isAllComplete={false}
          lastSavedAt={null}
        />
      );
      expect(screen.getByRole("button", { name: "Save workout" })).toBeInTheDocument();
    });

    it("shows 'Complete workout' when all exercises are complete", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={false}
          isAllComplete={true}
          lastSavedAt={null}
        />
      );
      expect(screen.getByRole("button", { name: "Complete workout" })).toBeInTheDocument();
    });
  });

  describe("All done badge", () => {
    it("renders 'All done' badge when isAllComplete=true", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={false}
          isAllComplete={true}
          lastSavedAt={null}
        />
      );
      expect(screen.getByText("All done")).toBeInTheDocument();
    });

    it("does not render 'All done' badge when isAllComplete=false", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={false}
          isAllComplete={false}
          lastSavedAt={null}
        />
      );
      expect(screen.queryByText("All done")).not.toBeInTheDocument();
    });
  });

  describe("save button enabled state", () => {
    it("is disabled when !isDirty and !isAllComplete", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={false}
          isAllComplete={false}
          lastSavedAt={null}
        />
      );
      expect(screen.getByRole("button", { name: "Save workout" })).toBeDisabled();
    });

    it("is enabled when isDirty=true", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={true}
          isAllComplete={false}
          lastSavedAt={null}
        />
      );
      expect(screen.getByRole("button", { name: "Save workout" })).not.toBeDisabled();
    });

    it("is enabled when isAllComplete=true (even if !isDirty)", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={false}
          isAllComplete={true}
          lastSavedAt={null}
        />
      );
      expect(screen.getByRole("button", { name: "Complete workout" })).not.toBeDisabled();
    });
  });

  describe("save status text", () => {
    it("shows unsaved message when lastSavedAt is null", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={false}
          isAllComplete={false}
          lastSavedAt={null}
        />
      );
      expect(screen.getByText("Changes have not been saved yet.")).toBeInTheDocument();
    });

    it("shows 'Last saved:' when lastSavedAt is provided", () => {
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={noop}
          isDirty={false}
          isAllComplete={false}
          lastSavedAt="2026-05-16T10:00:00Z"
        />
      );
      expect(screen.getByText(/Last saved:/)).toBeInTheDocument();
    });
  });

  describe("callbacks", () => {
    it("calls onSave when save button clicked", () => {
      const onSave = vi.fn();
      render(
        <SaveWorkoutBar
          onSave={onSave}
          onReset={noop}
          isDirty={true}
          isAllComplete={false}
          lastSavedAt={null}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "Save workout" }));
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it("calls onReset when reset button clicked", () => {
      const onReset = vi.fn();
      render(
        <SaveWorkoutBar
          onSave={noop}
          onReset={onReset}
          isDirty={false}
          isAllComplete={false}
          lastSavedAt={null}
        />
      );
      fireEvent.click(screen.getByRole("button", { name: "Reset to template" }));
      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });
});
