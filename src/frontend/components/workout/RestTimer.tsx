"use client";

import { useEffect, useRef, useState } from "react";

const PRESETS = [60, 90, 120, 180];

type Props = {
  onClose: () => void;
};

export default function RestTimer({ onClose }: Props) {
  const [seconds, setSeconds] = useState(90);
  const [remaining, setRemaining] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isRunning = remaining !== null;

  function start(secs: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(secs);
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRemaining(null);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const display = remaining ?? seconds;
  const mins = Math.floor(display / 60);
  const secs = display % 60;
  const label = `${mins}:${String(secs).padStart(2, "0")}`;
  const done = remaining === 0;

  return (
    <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
          Rest timer
        </p>
        <button
          onClick={onClose}
          aria-label="Close rest timer"
          className="text-xs text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <p
        className={`mt-3 text-4xl font-semibold tabular-nums tracking-tight ${
          done ? "text-emerald-400" : "text-white"
        }`}
      >
        {done ? "Rest complete" : label}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => {
              setSeconds(p);
              start(p);
            }}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            {p}s
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-3">
        {!isRunning || done ? (
          <button
            onClick={() => start(seconds)}
            className="rounded-xl border border-indigo-400/30 bg-indigo-500/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500/25"
          >
            {done ? "Restart" : "Start"}
          </button>
        ) : (
          <button
            onClick={stop}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Stop
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = Math.max(5, seconds - 15);
              setSeconds(next);
              if (isRunning) start(next);
            }}
            aria-label="Decrease by 15 seconds"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            −15s
          </button>
          <button
            onClick={() => {
              const next = seconds + 15;
              setSeconds(next);
              if (isRunning) start(next);
            }}
            aria-label="Increase by 15 seconds"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            +15s
          </button>
        </div>
      </div>
    </div>
  );
}
