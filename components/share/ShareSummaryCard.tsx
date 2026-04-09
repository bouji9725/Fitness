import Card from "@/components/ui/Card";
import type { SharePayload } from "@/types/share";

type ShareSummaryCardProps = {
  payload: SharePayload;
};

export default function ShareSummaryCard({
  payload,
}: ShareSummaryCardProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">
          Coach Sharing Summary
        </h3>
        <p className="text-sm text-slate-500">
          Quick overview of what is currently available for sharing
        </p>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>Coach: {payload.coachName}</p>
        <p>Sharing enabled: {payload.sharingEnabled ? "Yes" : "No"}</p>
        <p>
          Body stats available: {payload.latestBodyStats ? "Yes" : "No"}
        </p>
        <p>InBody available: {payload.latestInBody ? "Yes" : "No"}</p>
        <p>Photo available: {payload.latestPhoto ? "Yes" : "No"}</p>
        <p>Saved workouts: {payload.savedWorkouts.length}</p>
        <p>
          Nutrition summary: {payload.latestNutritionSummary ? "Yes" : "No"}
        </p>
      </div>
    </Card>
  );
}