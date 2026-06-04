import { progressPhotoStore } from "@backend/stores/progress-photo-store";
import { apiErrorResponse, apiSuccessResponse } from "@backend/responses/api-response";
import { progressPhotoSchema } from "@backend/validation/schemas";
import { validate } from "@backend/validation/validate";
import { getAuthUserId } from "@backend/auth/session";
import { put } from "@vercel/blob";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const entries = await progressPhotoStore.listEntries(userId);
    return apiSuccessResponse(entries);
  } catch (error) {
    console.error("Failed to load progress photos:", error);
    return apiErrorResponse({ status: 500, message: "Failed to load progress photos." });
  }
}

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  try {
    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return apiErrorResponse({ status: 400, message: "Form data is required." });
    }

    const file = formData.get("file") as File | null;
    const date = formData.get("date") as string | null;
    const label = (formData.get("label") as string | null) || undefined;

    if (!file || !date) {
      return apiErrorResponse({
        status: 400,
        message: "File and date are required.",
        details: { file: file ? undefined : "required", date: date ? undefined : "required" },
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return apiErrorResponse({
        status: 400,
        message: "Invalid date format. Use YYYY-MM-DD.",
        details: { date: "Invalid format" },
      });
    }

    // Validate label length if provided
    if (label && label.length > 255) {
      return apiErrorResponse({
        status: 400,
        message: "Label must be 255 characters or less.",
        details: { label: "Too long" },
      });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return apiErrorResponse({
        status: 400,
        message: "File size must be less than 5MB.",
        details: { file: "Too large" },
      });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return apiErrorResponse({
        status: 400,
        message: "File must be an image.",
        details: { file: "Invalid type" },
      });
    }

    // Upload to Vercel Blob
    const filename = `${userId}/${date}/${Date.now()}-${file.name}`;
    const blob = await put(filename, file, { access: "private" });

    // Save to database
    const entry = await progressPhotoStore.addEntry(userId, {
      date,
      imageUrl: blob.url,
      label,
    });

    return apiSuccessResponse(entry, 201);
  } catch (error) {
    console.error("Failed to add progress photo:", error);
    return apiErrorResponse({ status: 500, message: "Failed to add progress photo." });
  }
}
