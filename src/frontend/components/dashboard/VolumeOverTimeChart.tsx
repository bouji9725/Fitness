"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyVolume } from "@shared/calculations/dashboard";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
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
      <p style={{ marginBottom: 4, color: "#cbd5e1", fontWeight: 600 }}>{label}</p>
      <p style={{ color: "#818cf8" }}>
        Volume:{" "}
        <strong>{Math.round(payload[0].value).toLocaleString()} kg</strong>
      </p>
    </div>
  );
}

function formatTick(v: number): string {
  if (v === 0) return "0";
  if (v >= 1000) return `${Math.round(v / 100) / 10}k`;
  return String(Math.round(v));
}

type Props = { data: WeeklyVolume[] };

export default function VolumeOverTimeChart({ data }: Props) {
  const hasData = data.some((w) => w.volume > 0);

  if (!hasData) {
    return (
      <div className="flex min-h-[180px] items-center justify-center text-sm text-slate-400">
        Log some workouts to see your volume trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.07)"
          vertical={false}
        />
        <XAxis
          dataKey="weekLabel"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={formatTick}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
        />
        <Bar
          dataKey="volume"
          fill="#818cf8"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
