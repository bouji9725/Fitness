import { calculateExerciseVolume } from "@/lib/calculations/workouts";
import type { WorkoutDay } from "@/types/workout";

type StoredWorkoutSession = {
  workout: WorkoutDay;
  savedAt: string;
};

export type DashboardMetrics = {
  totalSavedWorkouts: number;
  totalExercisesLogged: number;
  totalCompletedSets: number;
  totalVolume: number;
  recentWorkouts: StoredWorkoutSession[];
};

export function getDashboardMetrics(
  sessions: StoredWorkoutSession[]
): DashboardMetrics {
  const totalSavedWorkouts = sessions.length;

  const totalExercisesLogged = sessions.reduce(
    (sum, session) => sum + session.workout.exercises.length,
    0
  );

  const totalCompletedSets = sessions.reduce((sum, session) => {
    return (
      sum +
      session.workout.exercises.reduce((exerciseSum, exercise) => {
        return exerciseSum + exercise.sets.filter((set) => set.completed).length;
      }, 0)
    );
  }, 0);

  const totalVolume = sessions.reduce((sum, session) => {
    return (
      sum +
      session.workout.exercises.reduce((exerciseSum, exercise) => {
        return exerciseSum + calculateExerciseVolume(exercise.sets);
      }, 0)
    );
  }, 0);

  return {
    totalSavedWorkouts,
    totalExercisesLogged,
    totalCompletedSets,
    totalVolume,
    recentWorkouts: sessions.slice(0, 5),
  };
}