import ShareBodyStatsSummary from "./ShareBodyStatsSummary";
import ShareWorkoutSummary from "./ShareWorkoutSummary";
import ShareNutritionSummary from "./ShareNutritionSummary";
import type { SharePayload } from "@/types/share";

type ShareSummaryCardProps = {
  payload: SharePayload;
};

export default function ShareSummaryCard({ payload }: ShareSummaryCardProps) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ShareBodyStatsSummary
          latestBodyStats={payload.latestBodyStats}
          latestInBody={payload.latestInBody}
          latestPhoto={payload.latestPhoto}
        />

        <ShareNutritionSummary
          nutrition={payload.latestNutritionSummary}
        />
      </div>

      <ShareWorkoutSummary workouts={payload.savedWorkouts} />
    </div>
  );
}