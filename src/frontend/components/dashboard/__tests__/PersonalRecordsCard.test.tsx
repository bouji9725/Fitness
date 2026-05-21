import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PersonalRecordsCard from "../PersonalRecordsCard";
import type { WorkoutSessionRecord } from "@shared/types/workout";

function makeRecord(
  exercises: Array<{
    name: string;
    sets: Array<{ weight: number; reps: number; completed: boolean }>;
  }>
): WorkoutSessionRecord {
  return {
    session: {
      id: "s1",
      templateId: "t1",
      templateName: "Push Day",
      performedAt: "2026-01-01T10:00:00Z",
      status: "completed",
      exercises: exercises.map((ex, i) => ({
        id: `ex${i}`,
        name: ex.name,
        muscleGroup: "Chest",
        isCompleted: true,
        sets: ex.sets.map((s, j) => ({
          id: `set${i}${j}`,
          reps: s.reps,
          weight: s.weight,
          completed: s.completed,
        })),
      })),
      createdAt: "2026-01-01T10:00:00Z",
      updatedAt: "2026-01-01T10:00:00Z",
    },
    savedAt: "2026-01-01T10:05:00Z",
  };
}

describe("PersonalRecordsCard", () => {
  it("shows empty state when no sessions provided", () => {
    render(<PersonalRecordsCard sessions={[]} />);
    expect(
      screen.getByText(/Complete and save a workout/i)
    ).toBeInTheDocument();
  });

  it("shows exercise name when sessions contain completed sets", () => {
    const sessions = [
      makeRecord([{ name: "Bench Press", sets: [{ weight: 100, reps: 5, completed: true }] }]),
    ];
    render(<PersonalRecordsCard sessions={sessions} />);
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
  });

  it("shows heaviest weight and reps", () => {
    const sessions = [
      makeRecord([{ name: "Bench Press", sets: [{ weight: 100, reps: 5, completed: true }] }]),
    ];
    render(<PersonalRecordsCard sessions={sessions} />);
    expect(screen.getByText("100 kg")).toBeInTheDocument();
    expect(screen.getByText(/× 5/)).toBeInTheDocument();
  });

  it("picks the heaviest set across multiple sessions for the same exercise", () => {
    const sessions = [
      makeRecord([{ name: "Squat", sets: [{ weight: 80, reps: 5, completed: true }] }]),
      makeRecord([{ name: "Squat", sets: [{ weight: 120, reps: 3, completed: true }] }]),
    ];
    render(<PersonalRecordsCard sessions={sessions} />);
    expect(screen.getByText("120 kg")).toBeInTheDocument();
  });

  it("picks the heaviest set within the same session", () => {
    const sessions = [
      makeRecord([
        {
          name: "Deadlift",
          sets: [
            { weight: 100, reps: 5, completed: true },
            { weight: 140, reps: 1, completed: true },
          ],
        },
      ]),
    ];
    render(<PersonalRecordsCard sessions={sessions} />);
    expect(screen.getByText("140 kg")).toBeInTheDocument();
  });

  it("ignores incomplete sets", () => {
    const sessions = [
      makeRecord([
        {
          name: "OHP",
          sets: [
            { weight: 200, reps: 1, completed: false },
            { weight: 60, reps: 8, completed: true },
          ],
        },
      ]),
    ];
    render(<PersonalRecordsCard sessions={sessions} />);
    expect(screen.queryByText("200 kg")).not.toBeInTheDocument();
    expect(screen.getByText("60 kg")).toBeInTheDocument();
  });

  it("shows empty state when all sets are incomplete", () => {
    const sessions = [
      makeRecord([
        {
          name: "OHP",
          sets: [{ weight: 100, reps: 5, completed: false }],
        },
      ]),
    ];
    render(<PersonalRecordsCard sessions={sessions} />);
    expect(screen.getByText(/Complete and save a workout/i)).toBeInTheDocument();
  });

  it("lists exercises in alphabetical order", () => {
    const sessions = [
      makeRecord([
        { name: "Squat", sets: [{ weight: 100, reps: 5, completed: true }] },
        { name: "Bench Press", sets: [{ weight: 80, reps: 8, completed: true }] },
        { name: "Deadlift", sets: [{ weight: 120, reps: 3, completed: true }] },
      ]),
    ];
    render(<PersonalRecordsCard sessions={sessions} />);
    const names = screen
      .getAllByRole("paragraph")
      .map((el) => el.textContent)
      .filter((t) => ["Squat", "Bench Press", "Deadlift"].includes(t ?? ""));
    expect(names).toEqual(["Bench Press", "Deadlift", "Squat"]);
  });

  it("is case-insensitive when deduplicating the same exercise", () => {
    const sessions = [
      makeRecord([{ name: "bench press", sets: [{ weight: 80, reps: 8, completed: true }] }]),
      makeRecord([{ name: "Bench Press", sets: [{ weight: 100, reps: 5, completed: true }] }]),
    ];
    render(<PersonalRecordsCard sessions={sessions} />);
    const weightEls = screen.getAllByText(/kg/);
    expect(weightEls).toHaveLength(1);
  });
});
