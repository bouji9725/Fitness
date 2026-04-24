import { ApiError } from "./api-error";
import type { UserProfile } from "@/types/profile";

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

export async function getProfile(): Promise<UserProfile> {
  const response = await fetch("/api/profile", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<UserProfile>(response);
}

export async function updateProfile(profile: UserProfile): Promise<UserProfile> {
  const response = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(profile),
  });

  return parseApiResponse<UserProfile>(response);
}