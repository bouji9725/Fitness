import type { WorkoutTemplate } from "@/types/workout";

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: "push-day",
    name: "Push Day",
    exercises: [
      {
        id: "bench-press",
        name: "Bench Press",
        muscleGroup: "Chest",
        previousBest: {
          reps: 8,
          weight: 80,
        },
        defaultSets: [
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
        defaultSets: [
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
    exercises: [
      {
        id: "barbell-row",
        name: "Barbell Row",
        muscleGroup: "Back",
        previousBest: {
          reps: 8,
          weight: 70,
        },
        defaultSets: [
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
    exercises: [
      {
        id: "squat",
        name: "Squat",
        muscleGroup: "Legs",
        previousBest: {
          reps: 6,
          weight: 100,
        },
        defaultSets: [
          { id: "set-1", reps: 6, weight: 100, completed: false },
          { id: "set-2", reps: 6, weight: 100, completed: false },
          { id: "set-3", reps: 6, weight: 100, completed: false },
        ],
      },
    ],
  },
];