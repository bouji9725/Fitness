import { ApiError } from "./api-error";
import type { MealLogEntry, MealPreference } from "@shared/types/nutrition";

type ApiErrorPayload = {
  error?: {
    message?: string;
    details?: unknown;
  };
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | ApiErrorPayload
    | T
    | null;

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      data.error?.message
        ? data.error.message
        : "API request failed.";

    const details =
      data && typeof data === "object" && "error" in data
        ? data.error?.details
        : undefined;

    throw new ApiError(message, response.status, details);
  }

  return data as T;
}

export async function getMealPreference(): Promise<MealPreference | null> {
  const response = await fetch("/api/meal-preference", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<MealPreference | null>(response);
}

export async function saveMealPreference(
  pref: MealPreference
): Promise<MealPreference> {
  const response = await fetch("/api/meal-preference", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(pref),
  });

  return parseApiResponse<MealPreference>(response);
}

export async function listMealLogs(date: string): Promise<MealLogEntry[]> {
  const response = await fetch(
    `/api/meal-logs?date=${encodeURIComponent(date)}`,
    { method: "GET", cache: "no-store" }
  );

  return parseApiResponse<MealLogEntry[]>(response);
}

export async function saveMealLog(
  entry: Omit<MealLogEntry, "id">
): Promise<MealLogEntry> {
  const response = await fetch("/api/meal-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(entry),
  });

  return parseApiResponse<MealLogEntry>(response);
}

export async function deleteMealLog(id: string): Promise<void> {
  const response = await fetch(`/api/meal-logs/${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });

  await parseApiResponse<{ deleted: boolean }>(response);
}
