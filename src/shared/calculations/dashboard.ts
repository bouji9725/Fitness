import { calculateExerciseVolume } from "@shared/calculations/workouts";
import type { WorkoutSessionRecord } from "@shared/types/workout";

// ── Analytics helpers ─────────────────────────────────────────────────────────

export type WeeklyVolume = { weekStart: string; weekLabel: string; volume: number };
export type MuscleGroupVolume = { muscleGroup: string; volume: number; pct: number };

function getWeekStart(dateStr: string): string {
  const datePart = dateStr.slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  const mon = new Date(date);
  mon.setDate(date.getDate() + diff);
  return `${mon.getFullYear()}-${String(mon.getMonth() + 1).padStart(2, "0")}-${String(mon.getDate()).padStart(2, "0")}`;
}

function formatWeekLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getWeeklyVolume(
  sessions: WorkoutSessionRecord[],
  weeksBack = 8
): WeeklyVolume[] {
  const volumeMap = new Map<string, number>();
  for (const record of sessions) {
    const ws = getWeekStart(record.session.performedAt);
    const vol = record.session.exercises.reduce(
      (s, ex) => s + calculateExerciseVolume(ex.sets), 0
    );
    volumeMap.set(ws, (volumeMap.get(ws) ?? 0) + vol);
  }

  const result: WeeklyVolume[] = [];
  const today = new Date();
  for (let i = weeksBack - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 7);
    const ws = getWeekStart(d.toISOString().slice(0, 10));
    if (!result.find((r) => r.weekStart === ws)) {
      result.push({ weekStart: ws, weekLabel: formatWeekLabel(ws), volume: volumeMap.get(ws) ?? 0 });
    }
  }
  return result;
}

export function getMuscleGroupVolume(sessions: WorkoutSessionRecord[]): MuscleGroupVolume[] {
  const map = new Map<string, number>();
  for (const record of sessions) {
    for (const ex of record.session.exercises) {
      const vol = calculateExerciseVolume(ex.sets);
      const group = ex.muscleGroup || "Other";
      map.set(group, (map.get(group) ?? 0) + vol);
    }
  }
  const total = [...map.values()].reduce((a, b) => a + b, 0);
  return [...map.entries()]
    .map(([muscleGroup, volume]) => ({
      muscleGroup,
      volume,
      pct: total > 0 ? Math.round((volume / total) * 100) : 0,
    }))
    .sort((a, b) => b.volume - a.volume);
}

export function getWorkoutDates(sessions: WorkoutSessionRecord[]): Set<string> {
  return new Set(sessions.map((r) => r.session.performedAt.slice(0, 10)));
}

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
