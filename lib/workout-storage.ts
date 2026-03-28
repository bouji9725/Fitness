import type { WorkoutDay } from "@/types/workout";

function getWorkoutStorageKey(workoutId: string) {
  return `fitness-workout-session:${workoutId}`;
}

export function saveWorkoutSession(workout: WorkoutDay): void {
  if (typeof window === "undefined") return;

  const key = getWorkoutStorageKey(workout.id);
  const payload = {
    workout,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(key, JSON.stringify(payload));
}

export function loadWorkoutSession(
  workoutId: string
): { workout: WorkoutDay; savedAt: string } | null {
  if (typeof window === "undefined") return null;

  const key = getWorkoutStorageKey(workoutId);
  const raw = localStorage.getItem(key);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as { workout: WorkoutDay; savedAt: string };
  } catch {
    return null;
  }
}

export function clearWorkoutSession(workoutId: string): void {
  if (typeof window === "undefined") return;

  const key = getWorkoutStorageKey(workoutId);
  localStorage.removeItem(key);
}