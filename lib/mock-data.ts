import type { WorkoutDay } from "@/types/workout";

export const workoutDays: WorkoutDay[] = [
  {
    id: "push-day",
    name: "Push Day",
    date: "2026-03-28",
    exercises: [
      {
        id: "bench-press",
        name: "Bench Press",
        muscleGroup: "Chest",
        previousBest: {
          reps: 8,
          weight: 80,
        },
        sets: [
          { id: "set-1", reps: 8, weight: 80, completed: false },
          { id: "set-2", reps: 8, weight: 80, completed: false },
          { id: "set-3", reps: 8, weight: 80, completed: false },
        ],
      },
      {
        id: "shoulder-press",
        name: "Shoulder Press",
        muscleGroup: "Shoulders",
        previousBest: {
          reps: 10,
          weight: 24,
        },
        sets: [
          { id: "set-1", reps: 10, weight: 24, completed: false },
          { id: "set-2", reps: 10, weight: 24, completed: false },
          { id: "set-3", reps: 10, weight: 24, completed: false },
        ],
      },
    ],
  },
  {
    id: "pull-day",
    name: "Pull Day",
    date: "2026-03-29",
    exercises: [
      {
        id: "barbell-row",
        name: "Barbell Row",
        muscleGroup: "Back",
        previousBest: {
          reps: 8,
          weight: 70,
        },
        sets: [
          { id: "set-1", reps: 8, weight: 70, completed: false },
          { id: "set-2", reps: 8, weight: 70, completed: false },
          { id: "set-3", reps: 8, weight: 70, completed: false },
        ],
      },
    ],
  },
  {
    id: "legs-day",
    name: "Leg Day",
    date: "2026-03-30",
    exercises: [
      {
        id: "squat",
        name: "Squat",
        muscleGroup: "Legs",
        previousBest: {
          reps: 6,
          weight: 100,
        },
        sets: [
          { id: "set-1", reps: 6, weight: 100, completed: false },
          { id: "set-2", reps: 6, weight: 100, completed: false },
          { id: "set-3", reps: 6, weight: 100, completed: false },
        ],
      },
    ],
  },
];