import Card from "./Card";

type StatCardProps = {
  label: string;
  value: string | number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </Card>
  );
}