type PreviousPerformanceProps = {
  reps?: number;
  weight?: number;
};

export default function PreviousPerformance({
  reps,
  weight,
}: PreviousPerformanceProps) {
  if (reps == null || weight == null) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Personal best
        </p>
        <p className="mt-1 text-sm text-slate-400">
          No previous data — this will update after your first saved session.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
        Personal best
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-white">
        {weight} kg{" "}
        <span className="text-base font-normal text-slate-400">× {reps} reps</span>
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Beat this weight or reps to make progressive overload.
      </p>
    </div>
  );
}
