import { describe, it, expect } from "vitest";
import { workoutSessionReducer } from "@frontend/workout-session-reducer";
import type { SessionExercise, SetEntry, WorkoutSession } from "@shared/types/workout";

function makeSet(overrides?: Partial<SetEntry>): SetEntry {
  return { id: "set1", reps: 10, weight: 60, completed: false, ...overrides };
}

function makeExercise(overrides?: Partial<SessionExercise>): SessionExercise {
  return {
    id: "ex1",
    name: "Bench Press",
    muscleGroup: "Chest",
    isCompleted: false,
    sets: [makeSet()],
    ...overrides,
  };
}

function makeSession(overrides?: Partial<WorkoutSession>): WorkoutSession {
  return {
    id: "s1",
    templateId: "t1",
    templateName: "Push Day",
    performedAt: "2026-01-01T10:00:00Z",
    status: "draft",
    exercises: [],
    createdAt: "2026-01-01T10:00:00Z",
    updatedAt: "2026-01-01T10:00:00Z",
    ...overrides,
  };
}

describe("workoutSessionReducer", () => {
  describe("RESET_WORKOUT", () => {
    it("initialises state from null", () => {
      const session = makeSession();
      const result = workoutSessionReducer(null, {
        type: "RESET_WORKOUT",
        initialWorkout: session,
      });
      expect(result?.id).toBe("s1");
      expect(result?.templateName).toBe("Push Day");
    });

    it("replaces existing state", () => {
      const old = makeSession({ id: "old" });
      const next = makeSession({ id: "new" });
      const result = workoutSessionReducer(old, {
        type: "RESET_WORKOUT",
        initialWorkout: next,
      });
      expect(result?.id).toBe("new");
    });

    it("returns null for unhandled actions when state is null", () => {
      const result = workoutSessionReducer(null, {
        type: "ADD_EXERCISE",
        exercise: makeExercise(),
      });
      expect(result).toBeNull();
    });
  });

  describe("UPDATE_SET_REPS", () => {
    it("updates reps on the correct set", () => {
      const session = makeSession({
        exercises: [makeExercise({ sets: [makeSet({ id: "set1", reps: 10 })] })],
      });
      const result = workoutSessionReducer(session, {
        type: "UPDATE_SET_REPS",
        exerciseId: "ex1",
        setId: "set1",
        reps: 12,
      });
      expect(result?.exercises[0].sets[0].reps).toBe(12);
    });

    it("does not modify other sets", () => {
      const session = makeSession({
        exercises: [
          makeExercise({
            sets: [
              makeSet({ id: "set1", reps: 10 }),
              makeSet({ id: "set2", reps: 8 }),
            ],
          }),
        ],
      });
      const result = workoutSessionReducer(session, {
        type: "UPDATE_SET_REPS",
        exerciseId: "ex1",
        setId: "set1",
        reps: 15,
      });
      expect(result?.exercises[0].sets[1].reps).toBe(8);
    });
  });

  describe("UPDATE_SET_WEIGHT", () => {
    it("updates weight on the correct set", () => {
      const session = makeSession({
        exercises: [makeExercise({ sets: [makeSet({ id: "set1", weight: 60 })] })],
      });
      const result = workoutSessionReducer(session, {
        type: "UPDATE_SET_WEIGHT",
        exerciseId: "ex1",
        setId: "set1",
        weight: 80,
      });
      expect(result?.exercises[0].sets[0].weight).toBe(80);
    });
  });

  describe("TOGGLE_SET_COMPLETED", () => {
    it("toggles a single set from false to true", () => {
      const session = makeSession({
        exercises: [makeExercise({ sets: [makeSet({ completed: false })] })],
      });
      const result = workoutSessionReducer(session, {
        type: "TOGGLE_SET_COMPLETED",
        exerciseId: "ex1",
        setId: "set1",
      });
      expect(result?.exercises[0].sets[0].completed).toBe(true);
    });

    it("toggles a single set from true to false", () => {
      const session = makeSession({
        exercises: [makeExercise({ sets: [makeSet({ completed: true })] })],
      });
      const result = workoutSessionReducer(session, {
        type: "TOGGLE_SET_COMPLETED",
        exerciseId: "ex1",
        setId: "set1",
      });
      expect(result?.exercises[0].sets[0].completed).toBe(false);
    });
  });

  describe("TOGGLE_EXERCISE_COMPLETED", () => {
    it("marks exercise and all sets as completed when previously incomplete", () => {
      const session = makeSession({
        exercises: [
          makeExercise({
            isCompleted: false,
            sets: [
              makeSet({ id: "s1", completed: false }),
              makeSet({ id: "s2", completed: false }),
            ],
          }),
        ],
      });
      const result = workoutSessionReducer(session, {
        type: "TOGGLE_EXERCISE_COMPLETED",
        exerciseId: "ex1",
      });
      expect(result?.exercises[0].isCompleted).toBe(true);
      expect(result?.exercises[0].sets[0].completed).toBe(true);
      expect(result?.exercises[0].sets[1].completed).toBe(true);
    });

    it("marks exercise and all sets as incomplete when previously completed", () => {
      const session = makeSession({
        exercises: [
          makeExercise({
            isCompleted: true,
            sets: [
              makeSet({ id: "s1", completed: true }),
              makeSet({ id: "s2", completed: true }),
            ],
          }),
        ],
      });
      const result = workoutSessionReducer(session, {
        type: "TOGGLE_EXERCISE_COMPLETED",
        exerciseId: "ex1",
      });
      expect(result?.exercises[0].isCompleted).toBe(false);
      expect(result?.exercises[0].sets[0].completed).toBe(false);
      expect(result?.exercises[0].sets[1].completed).toBe(false);
    });

    it("does not affect other exercises", () => {
      const session = makeSession({
        exercises: [
          makeExercise({ id: "ex1", isCompleted: false }),
          makeExercise({ id: "ex2", isCompleted: false }),
        ],
      });
      const result = workoutSessionReducer(session, {
        type: "TOGGLE_EXERCISE_COMPLETED",
        exerciseId: "ex1",
      });
      expect(result?.exercises[1].isCompleted).toBe(false);
    });
  });

  describe("ADD_SET", () => {
    it("appends a new set with reps=10 and weight=0", () => {
      const session = makeSession({
        exercises: [makeExercise({ sets: [makeSet()] })],
      });
      const result = workoutSessionReducer(session, {
        type: "ADD_SET",
        exerciseId: "ex1",
      });
      const sets = result?.exercises[0].sets ?? [];
      expect(sets).toHaveLength(2);
      expect(sets[1].reps).toBe(10);
      expect(sets[1].weight).toBe(0);
      expect(sets[1].completed).toBe(false);
    });
  });

  describe("REMOVE_SET", () => {
    it("removes the correct set", () => {
      const session = makeSession({
        exercises: [
          makeExercise({
            sets: [
              makeSet({ id: "set1" }),
              makeSet({ id: "set2" }),
            ],
          }),
        ],
      });
      const result = workoutSessionReducer(session, {
        type: "REMOVE_SET",
        exerciseId: "ex1",
        setId: "set1",
      });
      const sets = result?.exercises[0].sets ?? [];
      expect(sets).toHaveLength(1);
      expect(sets[0].id).toBe("set2");
    });
  });

  describe("ADD_EXERCISE", () => {
    it("appends the exercise to the list", () => {
      const session = makeSession({ exercises: [] });
      const newExercise = makeExercise({ id: "ex2", name: "Squat" });
      const result = workoutSessionReducer(session, {
        type: "ADD_EXERCISE",
        exercise: newExercise,
      });
      expect(result?.exercises).toHaveLength(1);
      expect(result?.exercises[0].name).toBe("Squat");
    });

    it("preserves existing exercises", () => {
      const session = makeSession({
        exercises: [makeExercise({ id: "ex1", name: "Bench Press" })],
      });
      const result = workoutSessionReducer(session, {
        type: "ADD_EXERCISE",
        exercise: makeExercise({ id: "ex2", name: "Squat" }),
      });
      expect(result?.exercises).toHaveLength(2);
      expect(result?.exercises[0].name).toBe("Bench Press");
    });
  });
});
