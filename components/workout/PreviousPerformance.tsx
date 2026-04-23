type PreviousPerformanceProps = {
  reps?: number;
  weight?: number;
};

// Lightweight previous-best display.
// Keep this helpful but visually quiet.
export default function PreviousPerformance({
  reps,
  weight,
}: PreviousPerformanceProps) {
  if (reps == null || weight == null) {
    return (
      <p className="text-sm text-slate-400">
        No previous data
      </p>
    );
  }

  return (
    <p className="text-sm text-slate-300">
      Previous best: {weight} kg — {reps} reps
    </p>
  );
}