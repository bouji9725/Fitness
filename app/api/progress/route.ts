import { progressStore } from "@/lib/server/progress-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@/lib/server/api-response";
import { Prisma } from "@/lib/generated/prisma/client";
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

export async function GET() {
  try {
    const entries = await progressStore.listEntries();
    return apiSuccessResponse(entries);
  } catch (error) {
    console.error("Failed to load progress entries:", error);
    return apiErrorResponse({
      status: 500,
      message: "Failed to load progress entries.",
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const entry = validateProgressEntryPayload(body);

    if (!entry) {
      return apiErrorResponse({
        status: 400,
        message: "Valid progress entry payload is required.",
      });
    }

    const entries = await progressStore.addEntry(entry);
    return apiSuccessResponse(entries, 201);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return apiErrorResponse({
        status: 409,
        message: "Duplicated ID: a progress entry with this ID already exists.",
      });
    }
    console.error("Failed to add progress entry:", error);
    return apiErrorResponse({
      status: 500,
      message: "Failed to add progress entry.",
    });
  }
}
