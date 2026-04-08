import Card from "./Card";

type StatCardProps = {
  label: string;
  value: string | number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <Card>
      <p>{label}</p>
      <p className="mt-2">{value}</p>
    </Card>
  );
}
