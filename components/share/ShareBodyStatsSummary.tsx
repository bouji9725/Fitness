import Card from "@/components/ui/Card";
import type { SharePayload } from "@/types/share";

type ShareBodyStatsSummaryProps = {
  payload: SharePayload;
};

export default function ShareBodyStatsSummary({
  payload,
}: ShareBodyStatsSummaryProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900">
          Body Stats Shared
        </h3>
        <p className="text-sm text-slate-500">
          Latest available body progress data
        </p>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>
          Latest body stats:{" "}
          {payload.latestBodyStats
            ? new Date(payload.latestBodyStats.date).toLocaleDateString()
            : "No body stats shared"}
        </p>

        <p>
          Latest InBody:{" "}
          {payload.latestInBody
            ? new Date(payload.latestInBody.date).toLocaleDateString()
            : "No InBody entry shared"}
        </p>

        <p>
          Latest photo:{" "}
          {payload.latestPhoto
            ? new Date(payload.latestPhoto.date).toLocaleDateString()
            : "No progress photo shared"}
        </p>
      </div>
    </Card>
  );
}