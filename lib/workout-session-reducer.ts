import type { WorkoutDay, Exercise, SetEntry } from "@/types/workout";

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
      exercise: Exercise;
    }
  | {
      type: "RESET_WORKOUT";
      initialWorkout: WorkoutDay;
    };

function createEmptySet(index: number): SetEntry {
  return {
    id: `set-${Date.now()}-${index}`,
    reps: 0,
    weight: 0,
    completed: false,
  };
}

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

    case "TOGGLE_EXERCISE_COMPLETED":
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : { ...exercise, isCompleted: !exercise.isCompleted }
        ),
      };

    case "ADD_SET":
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : {
                ...exercise,
                sets: [...exercise.sets, createEmptySet(exercise.sets.length + 1)],
              }
        ),
      };

    case "REMOVE_SET":
      return {
        ...state,
        exercises: state.exercises.map((exercise) =>
          exercise.id !== action.exerciseId
            ? exercise
            : {
                ...exercise,
                sets: exercise.sets.filter((set) => set.id !== action.setId),
              }
        ),
      };

    case "ADD_EXERCISE":
      return {
        ...state,
        exercises: [...state.exercises, action.exercise],
      };

    case "RESET_WORKOUT":
      return action.initialWorkout;

    default:
      return state;
  }
}