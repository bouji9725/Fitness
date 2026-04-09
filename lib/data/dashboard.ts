import { calculateExerciseVolume } from "@/lib/calculations/workouts";
import type { WorkoutSessionRecord } from "@/types/workout";

export type DashboardMetrics = {
  totalSavedWorkouts: number;
  totalExercisesLogged: number;
  totalCompletedSets: number;
  totalVolume: number;
  recentWorkouts: WorkoutSessionRecord[];
};

export function getDashboardMetrics(
  sessions: WorkoutSessionRecord[]
): DashboardMetrics {
  const totalSavedWorkouts = sessions.length;

  const totalExercisesLogged = sessions.reduce((sum, record) => {
    return sum + record.session.exercises.length;
  }, 0);

  const totalCompletedSets = sessions.reduce((sum, record) => {
    return (
      sum +
      record.session.exercises.reduce((exerciseSum, exercise) => {
        return exerciseSum + exercise.sets.filter((set) => set.completed).length;
      }, 0)
    );
  }, 0);

  const totalVolume = sessions.reduce((sum, record) => {
    return (
      sum +
      record.session.exercises.reduce((exerciseSum, exercise) => {
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