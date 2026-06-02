"use client";

import { useEffect, useState } from "react";
import { searchExercises } from "@frontend/api/workouts-api";
import type { ExerciseCatalogEntry } from "@shared/types/workout";

const MUSCLE_GROUPS = [
  "Back", "Biceps", "Calves", "Chest", "Core",
  "Forearms", "Full Body", "Glutes", "Hamstrings",
  "Quads", "Shoulders", "Traps", "Triceps",
];

export default function ExerciseLibrarySection() {
  const [exercises, setExercises] = useState<ExerciseCatalogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    searchExercises({ search, muscle: muscleGroup, limit: 500 })
      .then(({ data }) => setExercises(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [search, muscleGroup]);

  const grouped = exercises.reduce<Record<string, ExerciseCatalogEntry[]>>((acc, ex) => {
    (acc[ex.muscleGroup] ??= []).push(ex);
    return acc;
  }, {});

  return (
    <section className="app-surface rounded-[var(--radius-xl)] p-5 sm:p-6 space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Exercise library
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Browse exercises
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          All available exercises grouped by muscle group. Use them when building a custom template.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises…"
          className="min-h-10 flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <select
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          className="min-h-10 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">All muscle groups</option>
          {MUSCLE_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : exercises.length === 0 ? (
        <p className="text-sm text-slate-400">No exercises match your search.</p>
      ) : muscleGroup ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((ex) => (
            <div key={ex.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm font-medium text-white">{ex.name}</p>
              <p className="mt-0.5 text-xs text-slate-400">{ex.muscleGroup}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([group, exs]) => (
            <div key={group}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                {group}
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {exs.map((ex) => (
                  <div key={ex.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-sm font-medium text-white">{ex.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
