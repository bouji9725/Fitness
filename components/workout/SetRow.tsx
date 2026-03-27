import type { SetEntry } from "@/types/workout";

type SetRowProps = {
  set: SetEntry;
};

export default function SetRow({ set }: SetRowProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] gap-3 rounded-xl border border-slate-200 p-3">
      <input
        type="number"
        value={set.reps}
        readOnly
        aria-label="Reps"
        className="min-h-11 rounded-xl border border-slate-200 px-3"
      />
      <input
        type="number"
        value={set.weight}
        readOnly
        aria-label="Weight"
        className="min-h-11 rounded-xl border border-slate-200 px-3"
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={set.completed}
          readOnly
          aria-label="Completed set"
          className="h-5 w-5 rounded"
        />
      </div>
    </div>
  );
}