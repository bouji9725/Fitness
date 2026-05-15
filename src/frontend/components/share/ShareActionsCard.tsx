"use client";

import Card from "@frontend/components/ui/Card";
import Button from "@frontend/components/ui/Button";
import type { SharePayload } from "@shared/types/share";
import {
  copyToClipboard,
  downloadJSON,
  downloadPDFReport,
  formatShareText,
} from "@frontend/export/share-export";

type ShareActionsCardProps = {
  payload: SharePayload;
};

export default function ShareActionsCard({ payload }: ShareActionsCardProps) {
  async function handleCopy() {
    const text = formatShareText(payload);
    await copyToClipboard(text);
    alert("Copied to clipboard!");
  }

  function handleDownloadJSON() {
    downloadJSON(payload, "fitness-progress.json");
  }

  function handleDownloadPDF() {
    downloadPDFReport(payload);
  }

  return (
    <Card className="grid gap-4">
      <div>
        <h3 className="text-xl font-semibold ">
          Export & Share
        </h3>
        <p className="text-sm ">
          Share your progress outside the app
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={handleCopy}>
          Copy Report
        </Button>

        <Button type="button" onClick={handleDownloadJSON}>
          Download JSON
        </Button>

        <Button type="button" variant="secondary" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </div>
    </Card>
  );
}
