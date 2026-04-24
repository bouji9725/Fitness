import type {
  WorkoutSession,
  WorkoutSessionRecord,
  WorkoutTemplate,
} from "@/types/workout";

async function parseApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : "API request failed.";

    throw new Error(message);
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
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ templateId }),
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

export async function listSavedWorkoutSessions(): Promise<
  WorkoutSessionRecord[]
> {
  const response = await fetch("/api/workout-sessions", {
    method: "GET",
    cache: "no-store",
  });

  return parseApiResponse<WorkoutSessionRecord[]>(response);
}