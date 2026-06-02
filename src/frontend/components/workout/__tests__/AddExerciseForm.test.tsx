import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AddExerciseForm from "../AddExerciseForm";

vi.mock("@frontend/api/workouts-api", () => ({
  searchExercises: vi.fn().mockResolvedValue({ data: [], total: 0 }),
}));

const BASE_MUSCLE_GROUPS = [
  "Back", "Biceps", "Calves", "Chest", "Core",
  "Forearms", "Glutes", "Hamstrings", "Legs",
  "Quads", "Shoulders", "Traps", "Triceps",
];

beforeEach(() => {
  localStorage.clear();
});

function switchToCustom() {
  fireEvent.click(screen.getByRole("button", { name: "Custom" }));
}

describe("AddExerciseForm", () => {
  describe("tab navigation", () => {
    it("defaults to Library tab", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      expect(screen.getByRole("button", { name: "Library" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Custom" })).toBeInTheDocument();
    });

    it("switches to Custom tab on click", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      expect(screen.getByPlaceholderText(/Incline Dumbbell Press/i)).toBeInTheDocument();
    });
  });

  describe("initial render (Custom tab)", () => {
    it("renders all 13 base muscle groups as select options", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      const select = screen.getByRole("combobox");
      for (const group of BASE_MUSCLE_GROUPS) {
        expect(select).toHaveTextContent(group);
      }
    });

    it("renders 'Add a new muscle group' option", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      expect(screen.getByText("+ Add a new muscle group")).toBeInTheDocument();
    });

    it("Add exercise button is disabled when name and muscle group are empty", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      expect(screen.getByRole("button", { name: "Add exercise" })).toBeDisabled();
    });
  });

  describe("Add exercise button enabled state", () => {
    it("remains disabled after entering name only", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      fireEvent.change(screen.getByPlaceholderText(/Incline Dumbbell Press/i), {
        target: { value: "Squat" },
      });
      expect(screen.getByRole("button", { name: "Add exercise" })).toBeDisabled();
    });

    it("becomes enabled once name and muscle group are both set", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      fireEvent.change(screen.getByPlaceholderText(/Incline Dumbbell Press/i), {
        target: { value: "Squat" },
      });
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "Legs" } });
      expect(screen.getByRole("button", { name: "Add exercise" })).not.toBeDisabled();
    });
  });

  describe("adding an exercise", () => {
    it("calls onAddExercise with correct name and muscleGroup", () => {
      const onAddExercise = vi.fn();
      render(<AddExerciseForm onAddExercise={onAddExercise} />);
      switchToCustom();
      fireEvent.change(screen.getByPlaceholderText(/Incline Dumbbell Press/i), {
        target: { value: "Squat" },
      });
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "Legs" } });
      fireEvent.click(screen.getByRole("button", { name: "Add exercise" }));
      expect(onAddExercise).toHaveBeenCalledTimes(1);
      const arg = onAddExercise.mock.calls[0][0];
      expect(arg.name).toBe("Squat");
      expect(arg.muscleGroup).toBe("Legs");
      expect(arg.isCompleted).toBe(false);
      expect(Array.isArray(arg.sets)).toBe(true);
    });

    it("resets name and muscle group after adding", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      const nameInput = screen.getByPlaceholderText(/Incline Dumbbell Press/i);
      fireEvent.change(nameInput, { target: { value: "Squat" } });
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "Legs" } });
      fireEvent.click(screen.getByRole("button", { name: "Add exercise" }));
      expect((nameInput as HTMLInputElement).value).toBe("");
    });
  });

  describe("adding a new muscle group", () => {
    it("shows inline input when sentinel option is selected", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "__add_new__" } });
      expect(screen.getByPlaceholderText(/Rear Delts/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add group" })).toBeInTheDocument();
    });

    it("'Add group' button is disabled when draft is empty", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "__add_new__" } });
      expect(screen.getByRole("button", { name: "Add group" })).toBeDisabled();
    });

    it("confirms new group and hides inline input on button click", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "__add_new__" } });
      fireEvent.change(screen.getByPlaceholderText(/Rear Delts/i), {
        target: { value: "Rear Delts" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add group" }));
      expect(screen.queryByPlaceholderText(/Rear Delts/i)).not.toBeInTheDocument();
    });

    it("persists new group to localStorage", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "__add_new__" } });
      fireEvent.change(screen.getByPlaceholderText(/Rear Delts/i), {
        target: { value: "Rear Delts" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add group" }));
      const stored = JSON.parse(
        localStorage.getItem("fitsler-custom-muscle-groups") ?? "[]"
      );
      expect(stored).toContain("Rear Delts");
    });

    it("confirms new group on Enter key", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "__add_new__" } });
      fireEvent.change(screen.getByPlaceholderText(/Rear Delts/i), {
        target: { value: "Traps Extended" },
      });
      fireEvent.keyDown(screen.getByPlaceholderText(/Rear Delts/i), { key: "Enter" });
      expect(screen.queryByPlaceholderText(/Rear Delts/i)).not.toBeInTheDocument();
    });

    it("does not create a duplicate when group already exists (case-insensitive)", () => {
      render(<AddExerciseForm onAddExercise={vi.fn()} />);
      switchToCustom();
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "__add_new__" } });
      fireEvent.change(screen.getByPlaceholderText(/Rear Delts/i), {
        target: { value: "chest" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add group" }));
      const stored = JSON.parse(
        localStorage.getItem("fitsler-custom-muscle-groups") ?? "[]"
      );
      expect(stored).not.toContain("chest");
    });
  });
});
