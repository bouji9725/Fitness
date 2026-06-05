import { progressStore } from "@backend/stores/progress-store";
import {
  apiErrorResponse,
  apiSuccessResponse,
} from "@backend/responses/api-response";
import { progressEntrySchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
import { createId } from "@shared/utils/create-id";
import { Prisma } from "@/lib/generated/prisma/client";
import { getAuthUserId } from "@backend/auth/session";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const entries = await progressStore.listEntries(userId);
    return apiSuccessResponse(entries);
  } catch (error) {
    console.error("Failed to load progress entries:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load progress entries." });
  }
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const validation = validate(progressEntrySchema, body);

    if (!validation.ok) {
      return apiErrorResponse({
        status: 400,
        message: validation.error,
        details: validation.details,
      });
    }

    const entries = await progressStore.addEntry(userId, {
      id: createId("prog"),
      ...validation.data,
    });
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
    return apiErrorResponse({ status: 500, message: "Failed to add progress entry." });
  }
}
