import { ApiError } from "./api-error";
import type {
  WorkoutSession,
  WorkoutSessionRecord,
  WorkoutTemplate,
} from "@shared/types/workout";

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
      data &&
      typeof data === "object" &&
      "error" in data
        ? data.error?.details
        : undefined;

    throw new ApiError(message, response.status, details);
  }

  return data as T;
}

// Client-side workout API.
// UI components should call these functions instead of calling fetch directly.
export async function listWorkoutTemplates(): Promise<WorkoutTemplate[]> {
  const response = await fetch("/api/workout-templates", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<WorkoutTemplate[]>(response);
}

export async function createWorkoutSession(
  templateId: string
): Promise<WorkoutSession> {
  const response = await fetch("/api/workout-sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ templateId }),
  });

  return parseApiResponse<WorkoutSession>(response);
}

export async function createCustomWorkoutSession(
  name: string
): Promise<WorkoutSession> {
  const response = await fetch("/api/workout-sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ name }),
  });

  return parseApiResponse<WorkoutSession>(response);
}

export async function getWorkoutSession(
  sessionId: string
): Promise<WorkoutSession> {
  const response = await fetch(`/api/workout-sessions/${sessionId}`, {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<WorkoutSession>(response);
}

export async function updateWorkoutSession(
  session: WorkoutSession
): Promise<WorkoutSessionRecord> {
  const response = await fetch(`/api/workout-sessions/${session.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(session),
  });

  return parseApiResponse<WorkoutSessionRecord>(response);
}

export type SessionsPage = {
  data: WorkoutSessionRecord[];
  total: number;
};

export async function listSavedWorkoutSessions(options?: {
  limit?: number;
  offset?: number;
}): Promise<SessionsPage> {
  const params = new URLSearchParams();
  if (options?.limit != null) params.set("limit", String(options.limit));
  if (options?.offset != null) params.set("offset", String(options.offset));
  const qs = params.toString();

  const response = await fetch(
    `/api/workout-sessions${qs ? `?${qs}` : ""}`,
    { method: "GET", cache: "no-store" }
  );

  return parseApiResponse<SessionsPage>(response);
}

export async function listActiveWorkoutSessions(): Promise<WorkoutSession[]> {
  const response = await fetch("/api/workout-sessions?active=true", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<WorkoutSession[]>(response);
}

export async function hasWorkoutSessionForDate(date: string): Promise<boolean> {
  const response = await fetch(
    `/api/workout-sessions?date=${encodeURIComponent(date)}`,
    { method: "GET", cache: "no-store" }
  );
  const data = await parseApiResponse<{ hasSession: boolean }>(response);
  return data.hasSession;
}

export async function deleteWorkoutSession(sessionId: string): Promise<void> {
  const response = await fetch(`/api/workout-sessions/${sessionId}`, {
    method: "DELETE",
    cache: "no-store",
  });

  await parseApiResponse<{ deleted: boolean }>(response);
}
