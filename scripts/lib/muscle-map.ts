// Maps JSON primaryMuscles values to the app's muscle group vocabulary.
// Applied at seed time so DB-level filtering always uses the app's terms.
const MUSCLE_MAP: Record<string, string> = {
  lats: "Back",
  "middle back": "Back",
  "lower back": "Back",
  chest: "Chest",
  biceps: "Biceps",
  triceps: "Triceps",
  shoulders: "Shoulders",
  quadriceps: "Quads",
  hamstrings: "Hamstrings",
  glutes: "Glutes",
  calves: "Calves",
  abdominals: "Core",
  forearms: "Forearms",
  traps: "Traps",
  abductors: "Legs",
  adductors: "Legs",
  neck: "Neck",
};

export function toMuscleGroupTag(primaryMuscles: string[]): string {
  for (const muscle of primaryMuscles) {
    const tag = MUSCLE_MAP[muscle.toLowerCase()];
    if (tag) return tag;
  }
  return "Full Body";
}
