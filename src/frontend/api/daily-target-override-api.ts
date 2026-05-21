import { ApiError } from "./api-error";
import type { DailyTargetOverride } from "@shared/types/nutrition";

type ApiErrorPayload = {
  error?: { message?: string; details?: unknown };
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as ApiErrorPayload | T | null;
  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data && data.error?.message
        ? data.error.message
        : "API request failed.";
    const details =
      data && typeof data === "object" && "error" in data ? data.error?.details : undefined;
    throw new ApiError(message, response.status, details);
  }
  return data as T;
}

export async function getDailyTargetOverride(date: string): Promise<DailyTargetOverride | null> {
  const response = await fetch(`/api/daily-target-override?date=${encodeURIComponent(date)}`, {
    method: "GET",
    cache: "no-store",
  });
  return parseApiResponse<DailyTargetOverride | null>(response);
}

export async function saveDailyTargetOverride(
  date: string,
  data: Omit<DailyTargetOverride, "date">
): Promise<DailyTargetOverride> {
  const response = await fetch(`/api/daily-target-override?date=${encodeURIComponent(date)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(data),
  });
  return parseApiResponse<DailyTargetOverride>(response);
}

export async function deleteDailyTargetOverride(date: string): Promise<void> {
  const response = await fetch(`/api/daily-target-override?date=${encodeURIComponent(date)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  await parseApiResponse<{ deleted: boolean }>(response);
}
