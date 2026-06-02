"use client";

import { useEffect, useState } from "react";
import type { ExerciseCatalogEntry } from "@shared/types/workout";
import { searchExercises } from "@frontend/api/workouts-api";
import Input from "@frontend/components/ui/Input";
import Button from "@frontend/components/ui/Button";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "strength", label: "Strength" },
  { value: "stretching", label: "Stretching" },
  { value: "cardio", label: "Cardio" },
  { value: "powerlifting", label: "Powerlifting" },
  { value: "plyometrics", label: "Plyometrics" },
  { value: "strongman", label: "Strongman" },
  { value: "olympic weightlifting", label: "Olympic" },
];

const MUSCLE_GROUPS = [
  "Back", "Biceps", "Calves", "Chest", "Core",
  "Forearms", "Full Body", "Glutes", "Hamstrings",
  "Legs", "Neck", "Quads", "Shoulders", "Traps", "Triceps",
];

const PAGE_SIZE = 15;

type Props = {
  onSelect: (exercise: ExerciseCatalogEntry) => void;
};

export default function ExerciseLibraryPicker({ onSelect }: Props) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [muscle, setMuscle] = useState("");
  const [page, setPage] = useState(0);
  const [results, setResults] = useState<ExerciseCatalogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, category, muscle]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    searchExercises({
      search: debouncedSearch,
      category,
      muscle,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })
      .then(({ data, total }) => {
        if (!cancelled) {
          setResults(data);
          setTotal(total);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, category, muscle, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search 873 exercises…"
      />

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            category === ""
              ? "bg-indigo-500/25 text-white ring-1 ring-inset ring-indigo-400/40"
              : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          }`}
        >
          All
        </button>
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setCategory(category === value ? "" : value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              category === value
                ? "bg-indigo-500/25 text-white ring-1 ring-inset ring-indigo-400/40"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Muscle group filter */}
      <select
        value={muscle}
        onChange={(e) => setMuscle(e.target.value)}
        className="min-h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        <option value="" className="bg-slate-900">All muscle groups</option>
        {MUSCLE_GROUPS.map((g) => (
          <option key={g} value={g} className="bg-slate-900">{g}</option>
        ))}
      </select>

      {/* Results */}
      <div className="space-y-1.5">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
        ) : results.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No exercises found.</p>
        ) : (
          results.map((ex) => (
            <div
              key={ex.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{ex.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {ex.muscleGroup}
                  {ex.level ? ` · ${ex.level}` : ""}
                  {ex.equipment ? ` · ${ex.equipment}` : ""}
                </p>
              </div>
              <Button
                variant="secondary"
                className="shrink-0 !min-h-8 px-3 text-xs"
                onClick={() => onSelect(ex)}
              >
                + Add
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-3">
          <Button
            variant="ghost"
            className="!min-h-8 px-3 text-xs"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </Button>
          <span className="text-xs text-slate-400">
            {page + 1} / {totalPages}
            <span className="ml-1.5 text-slate-500">({total} total)</span>
          </span>
          <Button
            variant="ghost"
            className="!min-h-8 px-3 text-xs"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
