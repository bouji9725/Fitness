import Card from "@/components/ui/Card";
import type { WorkoutSessionRecord } from "@/types/workout";

type WorkoutInsightCardProps = {
  sessions: WorkoutSessionRecord[];
};

export default function WorkoutInsightCard({
  sessions,
}: WorkoutInsightCardProps) {
  const totalSessions = sessions.length;

  const completedSessions = sessions.filter(
    (item) => item.session.status === "completed"
  ).length;

  const latestSession = sessions[0];

  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">
          Workout Insights
        </h3>
        <p className="text-sm text-slate-500">
          Quick summary of your saved training sessions
        </p>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>Total sessions: {totalSessions}</p>
        <p>Completed sessions: {completedSessions}</p>
        <p>
          Latest session:{" "}
          {latestSession
            ? latestSession.session.templateName
            : "No sessions yet"}
        </p>
      </div>
    </Card>
  );
}