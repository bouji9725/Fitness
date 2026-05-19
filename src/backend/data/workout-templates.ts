import type { WorkoutTemplate } from "@shared/types/workout";

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: "push-day",
    name: "Push Day",
    exercises: [
      {
        id: "bench-press",
        name: "Bench Press",
        muscleGroup: "Chest",
        defaultSets: [
          { id: "set-1", reps: undefined, weight: undefined, completed: false },
          { id: "set-2", reps: undefined, weight: undefined, completed: false },
          { id: "set-3", reps: undefined, weight: undefined, completed: false },
        ],
      },
      {
        id: "shoulder-press",
        name: "Shoulder Press",
        muscleGroup: "Shoulders",
        defaultSets: [
          { id: "set-1", reps: undefined, weight: undefined, completed: false },
          { id: "set-2", reps: undefined, weight: undefined, completed: false },
          { id: "set-3", reps: undefined, weight: undefined, completed: false },
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
        defaultSets: [
          { id: "set-1", reps: undefined, weight: undefined, completed: false },
          { id: "set-2", reps: undefined, weight: undefined, completed: false },
          { id: "set-3", reps: undefined, weight: undefined, completed: false },
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
        defaultSets: [
          { id: "set-1", reps: undefined, weight: undefined, completed: false },
          { id: "set-2", reps: undefined, weight: undefined, completed: false },
          { id: "set-3", reps: undefined, weight: undefined, completed: false },
        ],
      },
    ],
  },
];