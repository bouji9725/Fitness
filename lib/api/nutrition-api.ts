import { ApiError } from "./api-error";
import type { NutritionResults } from "@/types/nutrition";

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

export async function getNutritionSummary(): Promise<NutritionResults | null> {
  const response = await fetch("/api/nutrition", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<NutritionResults | null>(response);
}

export async function saveNutritionSummaryApi(
  summary: NutritionResults
): Promise<NutritionResults> {
  const response = await fetch("/api/nutrition", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(summary),
  });

  return parseApiResponse<NutritionResults>(response);
}