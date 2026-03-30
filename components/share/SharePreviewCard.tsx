import Card from "@/components/ui/Card";
import type { SharePayload } from "@/types/share";

type SharePreviewCardProps = {
  payload: SharePayload;
};

export default function SharePreviewCard({ payload }: SharePreviewCardProps) {
  const previewText = `
Coach: ${payload.coachName}
Sharing enabled: ${payload.sharingEnabled ? "Yes" : "No"}

Latest body stats:
${payload.latestBodyStats ? `Weight ${payload.latestBodyStats.weightKg} kg, Body Fat ${payload.latestBodyStats.bodyFatPercent}%` : "No body stats"}

Latest InBody:
${payload.latestInBody ? `Weight ${payload.latestInBody.weightKg} kg, Body Fat ${payload.latestInBody.bodyFatPercent}%` : "No InBody entry"}

Latest nutrition:
${payload.latestNutritionSummary ? `Calories ${payload.latestNutritionSummary.calorieTarget}, Protein ${payload.latestNutritionSummary.proteinTargetGrams}g` : "No nutrition summary"}

Saved workouts included: ${payload.savedWorkouts.length}
  `.trim();

  return (
    <Card className="grid gap-4">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Share Preview</h3>
        <p className="text-sm text-slate-500">
          Preview of what would be shared with your coach
        </p>
      </div>

      <pre className="overflow-auto rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
        {previewText}
      </pre>
    </Card>
  );
}