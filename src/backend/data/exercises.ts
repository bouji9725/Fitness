import type { ExerciseCatalogEntry } from "@shared/types/workout";

export type { ExerciseCatalogEntry };

export const exerciseCatalog: ExerciseCatalogEntry[] = [
  // Chest
  { id: "bench-press", name: "Bench Press", muscleGroup: "Chest" },
  { id: "incline-bench-press", name: "Incline Bench Press", muscleGroup: "Chest" },
  { id: "decline-bench-press", name: "Decline Bench Press", muscleGroup: "Chest" },
  { id: "dumbbell-fly", name: "Dumbbell Fly", muscleGroup: "Chest" },
  { id: "cable-crossover", name: "Cable Crossover", muscleGroup: "Chest" },
  { id: "push-up", name: "Push-Up", muscleGroup: "Chest" },
  // Back
  { id: "barbell-row", name: "Barbell Row", muscleGroup: "Back" },
  { id: "pull-up", name: "Pull-Up", muscleGroup: "Back" },
  { id: "lat-pulldown", name: "Lat Pulldown", muscleGroup: "Back" },
  { id: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "Back" },
  { id: "t-bar-row", name: "T-Bar Row", muscleGroup: "Back" },
  { id: "deadlift", name: "Deadlift", muscleGroup: "Back" },
  { id: "single-arm-dumbbell-row", name: "Single-Arm Dumbbell Row", muscleGroup: "Back" },
  // Shoulders
  { id: "shoulder-press", name: "Shoulder Press", muscleGroup: "Shoulders" },
  { id: "dumbbell-shoulder-press", name: "Dumbbell Shoulder Press", muscleGroup: "Shoulders" },
  { id: "lateral-raise", name: "Lateral Raise", muscleGroup: "Shoulders" },
  { id: "front-raise", name: "Front Raise", muscleGroup: "Shoulders" },
  { id: "face-pull", name: "Face Pull", muscleGroup: "Shoulders" },
  { id: "arnold-press", name: "Arnold Press", muscleGroup: "Shoulders" },
  // Biceps
  { id: "barbell-curl", name: "Barbell Curl", muscleGroup: "Biceps" },
  { id: "dumbbell-curl", name: "Dumbbell Curl", muscleGroup: "Biceps" },
  { id: "hammer-curl", name: "Hammer Curl", muscleGroup: "Biceps" },
  { id: "preacher-curl", name: "Preacher Curl", muscleGroup: "Biceps" },
  { id: "incline-dumbbell-curl", name: "Incline Dumbbell Curl", muscleGroup: "Biceps" },
  // Triceps
  { id: "tricep-pushdown", name: "Tricep Pushdown", muscleGroup: "Triceps" },
  { id: "skull-crusher", name: "Skull Crusher", muscleGroup: "Triceps" },
  { id: "overhead-tricep-extension", name: "Overhead Tricep Extension", muscleGroup: "Triceps" },
  { id: "close-grip-bench-press", name: "Close-Grip Bench Press", muscleGroup: "Triceps" },
  { id: "dips", name: "Dips", muscleGroup: "Triceps" },
  // Quads
  { id: "squat", name: "Squat", muscleGroup: "Quads" },
  { id: "front-squat", name: "Front Squat", muscleGroup: "Quads" },
  { id: "leg-press", name: "Leg Press", muscleGroup: "Quads" },
  { id: "leg-extension", name: "Leg Extension", muscleGroup: "Quads" },
  { id: "bulgarian-split-squat", name: "Bulgarian Split Squat", muscleGroup: "Quads" },
  { id: "hack-squat", name: "Hack Squat", muscleGroup: "Quads" },
  // Hamstrings
  { id: "romanian-deadlift", name: "Romanian Deadlift", muscleGroup: "Hamstrings" },
  { id: "leg-curl", name: "Leg Curl", muscleGroup: "Hamstrings" },
  { id: "good-morning", name: "Good Morning", muscleGroup: "Hamstrings" },
  { id: "nordic-curl", name: "Nordic Curl", muscleGroup: "Hamstrings" },
  // Glutes
  { id: "hip-thrust", name: "Hip Thrust", muscleGroup: "Glutes" },
  { id: "glute-bridge", name: "Glute Bridge", muscleGroup: "Glutes" },
  { id: "cable-kickback", name: "Cable Kickback", muscleGroup: "Glutes" },
  { id: "sumo-deadlift", name: "Sumo Deadlift", muscleGroup: "Glutes" },
  // Calves
  { id: "standing-calf-raise", name: "Standing Calf Raise", muscleGroup: "Calves" },
  { id: "seated-calf-raise", name: "Seated Calf Raise", muscleGroup: "Calves" },
  { id: "donkey-calf-raise", name: "Donkey Calf Raise", muscleGroup: "Calves" },
  // Core
  { id: "plank", name: "Plank", muscleGroup: "Core" },
  { id: "crunch", name: "Crunch", muscleGroup: "Core" },
  { id: "cable-crunch", name: "Cable Crunch", muscleGroup: "Core" },
  { id: "leg-raise", name: "Leg Raise", muscleGroup: "Core" },
  { id: "ab-wheel-rollout", name: "Ab Wheel Rollout", muscleGroup: "Core" },
  { id: "russian-twist", name: "Russian Twist", muscleGroup: "Core" },
  // Traps
  { id: "barbell-shrug", name: "Barbell Shrug", muscleGroup: "Traps" },
  { id: "dumbbell-shrug", name: "Dumbbell Shrug", muscleGroup: "Traps" },
  { id: "rack-pull", name: "Rack Pull", muscleGroup: "Traps" },
  // Forearms
  { id: "wrist-curl", name: "Wrist Curl", muscleGroup: "Forearms" },
  { id: "reverse-curl", name: "Reverse Curl", muscleGroup: "Forearms" },
  { id: "farmers-carry", name: "Farmer's Carry", muscleGroup: "Forearms" },
  // Full Body
  { id: "clean-and-press", name: "Clean and Press", muscleGroup: "Full Body" },
  { id: "thruster", name: "Thruster", muscleGroup: "Full Body" },
  { id: "kettlebell-swing", name: "Kettlebell Swing", muscleGroup: "Full Body" },
  { id: "burpee", name: "Burpee", muscleGroup: "Full Body" },
];

export const MUSCLE_GROUPS = [
  ...new Set(exerciseCatalog.map((e) => e.muscleGroup)),
].sort();

export function filterExercises(
  search: string,
  muscleGroup: string
): ExerciseCatalogEntry[] {
  const q = search.toLowerCase().trim();
  return exerciseCatalog.filter((e) => {
    const matchesSearch = !q || e.name.toLowerCase().includes(q);
    const matchesMuscle = !muscleGroup || e.muscleGroup === muscleGroup;
    return matchesSearch && matchesMuscle;
  });
}
