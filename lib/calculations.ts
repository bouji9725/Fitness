import type { SetEntry } from "@/types/workout";

export function calculateSetVolume(weight: number, reps: number): number {
  return weight * reps;
}

export function calculateExerciseVolume(sets: SetEntry[]): number {
  return sets.reduce((total, set) => {
    if (!set.completed) return total;
    return total + set.weight * set.reps;
  }, 0);
}

export function isProgressiveOverload(
  currentWeight: number,
  currentReps: number,
  previousWeight: number,
  previousReps: number
): boolean {
  if (currentWeight > previousWeight) return true;
  if (currentWeight === previousWeight && currentReps > previousReps) return true;
  return false;
}