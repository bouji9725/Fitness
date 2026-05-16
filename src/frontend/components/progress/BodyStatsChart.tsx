"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BodyStatsEntry } from "@shared/types/progress";

type ChartPoint = {
  label: string;
  weightKg: number;
  bodyFatPercent: number;
  muscleMassKg?: number;
};

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; unit: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(2,6,23,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "0.75rem",
        padding: "10px 14px",
        fontSize: 12,
        color: "#f8fafc",
      }}
    >
      <p style={{ marginBottom: 6, fontWeight: 600, color: "#cbd5e1" }}>
        {label}
      </p>
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color, margin: "2px 0" }}>
          {item.name}: <strong>{item.value}{item.unit}</strong>
        </p>
      ))}
    </div>
  );
}

type Props = {
  entries: BodyStatsEntry[];
};

export default function BodyStatsChart({ entries }: Props) {
  if (entries.length < 2) {
    return (
      <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
        Add at least two check-ins to see your trend chart.
      </div>
    );
  }

  const hasMuscle = entries.some((e) => e.muscleMassKg != null);

  const data: ChartPoint[] = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({
      label: formatDate(e.date),
      weightKg: e.weightKg,
      bodyFatPercent: e.bodyFatPercent,
      ...(hasMuscle ? { muscleMassKg: e.muscleMassKg ?? 0 } : {}),
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.07)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="weight"
          orientation="left"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          unit=" kg"
          width={52}
        />
        <YAxis
          yAxisId="fat"
          orientation="right"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          unit="%"
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "#94a3b8", paddingTop: 12 }}
        />
        <Line
          yAxisId="weight"
          type="monotone"
          dataKey="weightKg"
          name="Weight"
          stroke="#818cf8"
          strokeWidth={2}
          dot={{ r: 3, fill: "#818cf8", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          unit=" kg"
        />
        <Line
          yAxisId="fat"
          type="monotone"
          dataKey="bodyFatPercent"
          name="Body fat"
          stroke="#34d399"
          strokeWidth={2}
          dot={{ r: 3, fill: "#34d399", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          unit="%"
        />
        {hasMuscle && (
          <Line
            yAxisId="weight"
            type="monotone"
            dataKey="muscleMassKg"
            name="Muscle mass"
            stroke="#fbbf24"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 3, fill: "#fbbf24", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            unit=" kg"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
