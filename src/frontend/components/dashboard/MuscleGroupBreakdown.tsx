"use client";

import type { MuscleGroupVolume } from "@shared/calculations/dashboard";

const MUSCLE_COLORS: Record<string, string> = {
  Chest: "#818cf8",
  Back: "#34d399",
  Shoulders: "#f472b6",
  Biceps: "#fb923c",
  Triceps: "#fbbf24",
  Quads: "#60a5fa",
  Hamstrings: "#a78bfa",
  Glutes: "#e879f9",
  Core: "#4ade80",
  Calves: "#94a3b8",
  Traps: "#f87171",
  Forearms: "#38bdf8",
  "Full Body": "#c084fc",
};

function getColor(group: string): string {
  return MUSCLE_COLORS[group] ?? "#818cf8";
}

function formatVolume(v: number): string {
  if (v >= 1000) return `${Math.round(v / 100) / 10}k`;
  return String(Math.round(v));
}

type Props = { data: MuscleGroupVolume[] };

export default function MuscleGroupBreakdown({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-[120px] items-center justify-center text-sm text-slate-400">
        Log workouts with exercises to see muscle group breakdown.
      </div>
    );
  }

  const top = data.slice(0, 8);
  const maxVolume = top[0]?.volume ?? 1;

  return (
    <div className="space-y-3">
      {top.map(({ muscleGroup, volume, pct }) => (
        <div key={muscleGroup} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300">{muscleGroup}</span>
            <span className="text-slate-500">
              {formatVolume(volume)} kg · {pct}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(volume / maxVolume) * 100}%`,
                backgroundColor: getColor(muscleGroup),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
