type PreviousPerformanceProps = {
  reps?: number;
  weight?: number;
};

export default function PreviousPerformance({
  reps,
  weight,
}: PreviousPerformanceProps) {
  if (reps == null || weight == null) {
    return <p className="text-sm text-slate-500">No previous data</p>;
  }

  return (
    <p className="text-sm text-slate-500">
      Previous best: <span className="font-medium text-slate-700">{weight} kg × {reps}</span>
    </p>
  );
}