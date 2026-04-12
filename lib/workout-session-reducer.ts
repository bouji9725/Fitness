import type { SessionExercise, SetEntry, WorkoutSession } from "@/types/workout";
import { touchWorkoutSession } from "@/lib/services/workout-session-service";
import { createId } from "@/lib/utils/create-id";

export type WorkoutSessionAction =
  | {
      type: "UPDATE_SET_REPS";
      exerciseId: string;
      setId: string;
      reps: number;
    }
  | {
      type: "UPDATE_SET_WEIGHT";
      exerciseId: string;
      setId: string;
      weight: number;
    }
  | {
      type: "TOGGLE_SET_COMPLETED";
      exerciseId: string;
      setId: string;
    }
  | {
      type: "TOGGLE_EXERCISE_COMPLETED";
      exerciseId: string;
    }
  | {
      type: "ADD_SET";
      exerciseId: string;
    }
  | {
      type: "REMOVE_SET";
      exerciseId: string;
      setId: string;
    }
  | {
      type: "ADD_EXERCISE";
      exercise: SessionExercise;
    }
  | {
      type: "RESET_WORKOUT";
      initialWorkout: WorkoutSession;
    };

function createEmptySet(): SetEntry {
  return {
    id: createId("set"),
    reps: 0,
    weight: 0,
    completed: false,
  };
}

export function workoutSessionReducer(
  state: WorkoutSession | null,
  action: WorkoutSessionAction
): WorkoutSession | null {
  if (!state) {
    switch (action.type) {
      case "RESET_WORKOUT":
        return action.initialWorkout;
      default:
        return state;
    }
  }

  switch (action.type) {
    case "UPDATE_SET_REPS":
      return touchWorkoutSession({
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id !== action.setId ? set : { ...set, reps: action.reps }
                ),
              }
        ),
      });

    case "UPDATE_SET_WEIGHT":
      return touchWorkoutSession({
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id !== action.setId
                    ? set
                    : { ...set, weight: action.weight }
                ),
              }
        ),
      });

    case "TOGGLE_SET_COMPLETED":
      return touchWorkoutSession({
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.id !== action.setId
                    ? set
                    : { ...set, completed: !set.completed }
                ),
              }
        ),
      });

    case "TOGGLE_EXERCISE_COMPLETED":
      return touchWorkoutSession({
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : {
                ...exercise,
                isCompleted: !exercise.isCompleted,
              }
        ),
      });

    case "ADD_SET":
      return touchWorkoutSession({
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : {
                ...exercise,
                sets: [...exercise.sets, createEmptySet()],
              }
        ),
      });

    case "REMOVE_SET":
      return touchWorkoutSession({
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : {
                ...exercise,
                sets: exercise.sets.filter((set) => set.id !== action.setId),
              }
        ),
      });

    case "ADD_EXERCISE":
      return touchWorkoutSession({
        ...state,
        exercises: [...state.exercises, action.exercise],
      });

    case "RESET_WORKOUT":
      return action.initialWorkout;

    default:
      return state;
  }
}