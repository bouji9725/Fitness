import { ApiError } from "./api-error";
import type { BodyStatsEntry, InBodyEntry, ProgressPhotoEntry } from "@shared/types/progress";

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
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(entry),
  });
  return parseApiResponse<BodyStatsEntry[]>(response);
}

export async function updateProgressEntry(
  id: string,
  data: Omit<BodyStatsEntry, "id">
): Promise<BodyStatsEntry> {
  const response = await fetch(`/api/progress/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(data),
  });
  return parseApiResponse<BodyStatsEntry>(response);
}

export async function deleteProgressEntry(id: string): Promise<void> {
  const response = await fetch(`/api/progress/${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  await parseApiResponse<{ deleted: boolean }>(response);
}

export async function listInBodyEntries(): Promise<InBodyEntry[]> {
  const response = await fetch("/api/inbody", { method: "GET", cache: "no-store" });
  return parseApiResponse<InBodyEntry[]>(response);
}

export async function addInBodyEntry(
  data: Omit<InBodyEntry, "id">
): Promise<InBodyEntry> {
  const response = await fetch("/api/inbody", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(data),
  });
  return parseApiResponse<InBodyEntry>(response);
}

export async function deleteInBodyEntry(id: string): Promise<void> {
  const response = await fetch(`/api/inbody/${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  await parseApiResponse<{ deleted: boolean }>(response);
}

export async function listProgressPhotos(): Promise<ProgressPhotoEntry[]> {
  const response = await fetch("/api/progress-photos", { method: "GET", cache: "no-store" });
  return parseApiResponse<ProgressPhotoEntry[]>(response);
}

export async function addProgressPhoto(
  data: FormData | Omit<ProgressPhotoEntry, "id">
): Promise<ProgressPhotoEntry> {
  const isFormData = data instanceof FormData;
  const response = await fetch("/api/progress-photos", {
    method: "POST",
    ...(isFormData ? {} : { headers: { "Content-Type": "application/json" } }),
    cache: "no-store",
    body: isFormData ? data : JSON.stringify(data),
  });
  return parseApiResponse<ProgressPhotoEntry>(response);
}

export async function deleteProgressPhoto(id: string): Promise<void> {
  const response = await fetch(`/api/progress-photos/${encodeURIComponent(id)}`, {
    method: "DELETE",
    cache: "no-store",
  });
  await parseApiResponse<{ deleted: boolean }>(response);
}