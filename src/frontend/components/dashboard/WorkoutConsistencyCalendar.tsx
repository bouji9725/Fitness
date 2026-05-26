"use client";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getMonthLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short" });
}

type Props = { workoutDates: Set<string> };

export default function WorkoutConsistencyCalendar({ workoutDates }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = toLocalDate(today);

  // Find the Monday 12 full weeks before this week's Monday
  const dayOfWeek = today.getDay(); // 0=Sun
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - daysToMonday);
  const startMonday = new Date(thisMonday);
  startMonday.setDate(thisMonday.getDate() - 12 * 7);

  // Build 7-column weeks from startMonday through today, padding the last week
  const allDays: string[] = [];
  const cursor = new Date(startMonday);
  while (toLocalDate(cursor) <= todayStr) {
    allDays.push(toLocalDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  while (allDays.length % 7 !== 0) {
    allDays.push(toLocalDate(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  // Split into weeks (rows)
  const weeks: string[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  // Month change labels per column
  let prevMonth = "";
  const monthLabels: (string | null)[] = weeks.map((week) => {
    const label = getMonthLabel(week[0]);
    if (label !== prevMonth) {
      prevMonth = label;
      return label;
    }
    return null;
  });

  const visibleWorkouts = allDays.filter(
    (d) => d <= todayStr && workoutDates.has(d)
  ).length;

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-300">
        <span className="font-semibold text-white">{visibleWorkouts}</span>
        <span className="ml-1 text-slate-400">
          sessions in the last 13 weeks
        </span>
        {workoutDates.size > visibleWorkouts && (
          <span className="ml-2 text-slate-500">
            · {workoutDates.size} total
          </span>
        )}
      </p>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-0" style={{ minWidth: "max-content" }}>
          {/* Month labels row */}
          <div className="mb-1 flex" style={{ paddingLeft: 32 }}>
            {weeks.map((_, i) => (
              <div
                key={i}
                style={{ width: 14, marginRight: 3, flexShrink: 0 }}
                className="text-[10px] text-slate-500 leading-none"
              >
                {monthLabels[i] ?? ""}
              </div>
            ))}
          </div>

          {/* Day labels + grid */}
          <div className="flex gap-0">
            {/* Day-of-week labels */}
            <div
              className="flex flex-col gap-[3px] mr-[6px]"
              style={{ width: 26 }}
            >
              {DAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="text-[10px] text-slate-500 leading-none flex items-center"
                  style={{ height: 14 }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px] mr-[3px]">
                {week.map((dateStr) => {
                  const isFuture = dateStr > todayStr;
                  const hasWorkout = workoutDates.has(dateStr);
                  return (
                    <div
                      key={dateStr}
                      title={isFuture ? "" : dateStr}
                      style={{ width: 14, height: 14, borderRadius: 3 }}
                      className={
                        isFuture
                          ? "bg-transparent"
                          : hasWorkout
                          ? "bg-indigo-400"
                          : "bg-white/[0.08]"
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
            <span>No workout</span>
            <div
              className="rounded-sm bg-white/[0.08]"
              style={{ width: 10, height: 10 }}
            />
            <div
              className="rounded-sm bg-indigo-400"
              style={{ width: 10, height: 10 }}
            />
            <span>Workout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
