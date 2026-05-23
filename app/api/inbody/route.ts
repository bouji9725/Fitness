import { inBodyStore } from "@backend/stores/inbody-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { validateInBodyEntryPayload } from "@backend/validation/progress-validation";
import { getAuthUserId } from "@backend/auth/session";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const entries = await inBodyStore.listEntries(userId);
    return apiSuccessResponse(entries);
  } catch (error) {
    console.error("Failed to load InBody entries:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load InBody entries." });
  }
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const body = await request.json().catch(() => null);
    const data = validateInBodyEntryPayload(body);

    if (!data) {
      return apiErrorResponse({ status: 400, message: "Valid InBody entry payload is required." });
    }

    const entry = await inBodyStore.addEntry(userId, data);
    return apiSuccessResponse(entry, 201);
  } catch (error) {
    console.error("Failed to add InBody entry:", error);
    return apiErrorResponse({ status: 500, message: "Failed to add InBody entry." });
  }
}
