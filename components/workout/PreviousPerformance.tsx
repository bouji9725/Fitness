type PreviousPerformanceProps = {
  reps?: number;
  weight?: number;
};

export default function PreviousPerformance({
  reps,
  weight,
}: PreviousPerformanceProps) {
  if (reps == null || weight == null) {
    return <p className="text-sm ">No previous data</p>;
  }

  return (
    <p className="text-sm ">
      Previous best: <span className="font-medium ">{weight} kg — {reps} reps</span>
    </p>
  );
}
