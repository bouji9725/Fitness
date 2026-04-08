import Card from "@/components/ui/Card";
import type { BodyStatsEntry, InBodyEntry, ProgressPhotoEntry } from "@/types/progress";

type ShareBodyStatsSummaryProps = {
  latestBodyStats: BodyStatsEntry | null;
  latestInBody: InBodyEntry | null;
  latestPhoto: ProgressPhotoEntry | null;
};

export default function ShareBodyStatsSummary({
  latestBodyStats,
  latestInBody,
  latestPhoto,
}: ShareBodyStatsSummaryProps) {
  return (
    <Card className="grid gap-4">
      <div>
        <h3 className="text-xl font-semibold ">Body Progress</h3>
        <p className="text-sm ">
          Latest body stats, photo, and composition data
        </p>
      </div>

      <div className="grid gap-3 text-sm ">
        {latestBodyStats ? (
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="font-medium ">Latest Body Stats</p>
            <p>Date: {latestBodyStats.date}</p>
            <p>Weight: {latestBodyStats.weightKg} kg</p>
            <p>Body Fat: {latestBodyStats.bodyFatPercent}%</p>
            {latestBodyStats.muscleMassKg != null ? (
              <p>Muscle Mass: {latestBodyStats.muscleMassKg} kg</p>
            ) : null}
          </div>
        ) : (
          <p>No body stats shared yet.</p>
        )}

        {latestInBody ? (
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="font-medium ">Latest InBody</p>
            <p>Date: {latestInBody.date}</p>
            <p>Weight: {latestInBody.weightKg} kg</p>
            <p>Body Fat: {latestInBody.bodyFatPercent}%</p>
          </div>
        ) : (
          <p>No InBody entry shared yet.</p>
        )}

        {latestPhoto ? (
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="font-medium ">Latest Progress Photo</p>
            <p>Date: {latestPhoto.date}</p>
            <p>{latestPhoto.label || "Progress photo"}</p>
          </div>
        ) : (
          <p>No progress photo shared yet.</p>
        )}
      </div>
    </Card>
  );
}
