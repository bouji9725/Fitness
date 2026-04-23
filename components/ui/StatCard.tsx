import Card from "./Card";

type StatCardProps = {
  label: string;
  value: string | number;
  helperText?: string;
};

// Compact metric card for dashboard-style summary values.
export default function StatCard({
  label,
  value,
  helperText,
}: StatCardProps) {
  return (
    <Card className="h-full p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>

      {helperText ? (
        <p className="mt-3 text-sm leading-6 text-slate-300">{helperText}</p>
      ) : null}
    </Card>
  );
}