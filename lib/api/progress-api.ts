import { ApiError } from "./api-error";
import type { BodyStatsEntry } from "@/types/progress";

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

export async function listProgressEntries(): Promise<BodyStatsEntry[]> {
  const response = await fetch("/api/progress", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<BodyStatsEntry[]>(response);
}

export async function addProgressEntry(
  entry: BodyStatsEntry
): Promise<BodyStatsEntry[]> {
  const response = await fetch("/api/progress", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(entry),
  });

  return parseApiResponse<BodyStatsEntry[]>(response);
}