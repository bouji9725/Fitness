"use client";

import { useEffect, useState } from "react";

type Phase = "fasting" | "eating" | "closed";

function parseHHMM(hhmm: string): { h: number; m: number } {
  const [h, m] = hhmm.split(":").map(Number);
  return { h, m };
}

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function getPhaseAndRemaining(startHHMM: string): {
  phase: Phase;
  remainingMin: number;
} {
  const { h, m } = parseHHMM(startHHMM);
  const startMin = h * 60 + m;
  const endMin = (startMin + 8 * 60) % 1440; // 8-hour eating window
  const now = nowMinutes();

  const wrapsBefore = endMin < startMin; // e.g. start=22:00, end=06:00

  let inWindow: boolean;
  if (wrapsBefore) {
    inWindow = now >= startMin || now < endMin;
  } else {
    inWindow = now >= startMin && now < endMin;
  }

  if (inWindow) {
    // Minutes until window closes
    const remaining = endMin > now ? endMin - now : 1440 - now + endMin;
    return { phase: "eating", remainingMin: remaining };
  }

  // Minutes until window opens
  const remaining = startMin > now ? startMin - now : 1440 - now + startMin;
  return { phase: "fasting", remainingMin: remaining };
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

type Props = {
  fastingWindowStart: string; // HH:MM
};

export default function FastingCountdown({ fastingWindowStart }: Props) {
  const [state, setState] = useState(() => getPhaseAndRemaining(fastingWindowStart));

  useEffect(() => {
    // Refresh every minute
    const id = setInterval(() => {
      setState(getPhaseAndRemaining(fastingWindowStart));
    }, 60_000);
    return () => clearInterval(id);
  }, [fastingWindowStart]);

  const { h: sh, m: sm } = parseHHMM(fastingWindowStart);
  const endMin = (sh * 60 + sm + 8 * 60) % 1440;
  const endLabel = `${String(Math.floor(endMin / 60)).padStart(2, "0")}:${String(endMin % 60).padStart(2, "0")}`;

  if (state.phase === "eating") {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3">
        <p className="text-sm font-medium text-emerald-200">Eating window open</p>
        <p className="mt-1 text-xs text-emerald-300/70">
          Closes at {endLabel} — {formatDuration(state.remainingMin)} remaining
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-600/40 bg-slate-800/50 px-4 py-3">
      <p className="text-sm font-medium text-slate-300">Fasting window</p>
      <p className="mt-1 text-xs text-slate-400">
        Eating window opens at {fastingWindowStart} — {formatDuration(state.remainingMin)} away
      </p>
    </div>
  );
}
