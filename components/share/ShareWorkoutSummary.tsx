import Card from "@/components/ui/Card";
import type { SharePayload } from "@/types/share";

type ShareWorkoutSummaryProps = {
  payload: SharePayload;
};

export default function ShareWorkoutSummary({
  payload,
}: ShareWorkoutSummaryProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">
          Workouts Shared
        </h3>
        <p className="text-sm text-slate-500">
          Recent saved workout sessions included in coach sharing
        </p>
      </div>

      {payload.savedWorkouts.length === 0 ? (
        <p className="text-sm text-slate-500">No workouts available to share.</p>
      ) : (
        <div className="space-y-3">
          {payload.savedWorkouts.map((item) => (
            <div
              key={item.session.id}
              className="rounded-xl border border-slate-200 p-3"
            >
              <p className="font-medium text-slate-900">
                {item.session.templateName}
              </p>
              <p className="text-sm text-slate-500">
                {new Date(item.session.performedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}