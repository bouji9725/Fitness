import type { WorkoutDay } from "@/types/workout";

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
      type: "RESET_WORKOUT";
      initialWorkout: WorkoutDay;
    };

export function workoutSessionReducer(
  state: WorkoutDay,
  action: WorkoutSessionAction
): WorkoutDay {
  switch (action.type) {
    case "UPDATE_SET_REPS":
      return {
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
      };

    case "UPDATE_SET_WEIGHT":
      return {
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
      };

    case "TOGGLE_SET_COMPLETED":
      return {
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
      };

    case "RESET_WORKOUT":
      return action.initialWorkout;

    default:
      return state;
  }
}