import { progressStore } from "@/lib/server/progress-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@/lib/server/api-response";
import type { BodyStatsEntry } from "@/types/progress";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function validateProgressEntryPayload(body: unknown): BodyStatsEntry | null {
  if (!isRecord(body)) return null;

  if (typeof body.id !== "string") return null;
  if (typeof body.date !== "string") return null;
  if (typeof body.weightKg !== "number") return null;
  if (typeof body.bodyFatPercent !== "number") return null;

  return {
    id: body.id,
    date: body.date,
    weightKg: body.weightKg,
    bodyFatPercent: body.bodyFatPercent,
    muscleMassKg:
      typeof body.muscleMassKg === "number" ? body.muscleMassKg : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  };
}

// GET /api/progress
// Returns all saved progress entries.
export async function GET() {
  return apiSuccessResponse(progressStore.listEntries());
}

// POST /api/progress
// Adds one progress entry and returns the updated list.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const entry = validateProgressEntryPayload(body);

  if (!entry) {
    return apiErrorResponse({
      status: 400,
      message: "Valid progress entry payload is required.",
    });
  }

  return apiSuccessResponse(progressStore.addEntry(entry), 201);
}