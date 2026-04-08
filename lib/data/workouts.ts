import type { WorkoutSession, WorkoutSessionRecord } from "@/types/workout";

const SESSION_KEY_PREFIX = "fitness-workout-session:";
const ACTIVE_TEMPLATE_SESSION_KEY_PREFIX = "fitness-active-session:";

function getSessionStorageKey(sessionId: string) {
  return `${SESSION_KEY_PREFIX}${sessionId}`;
}

function getActiveTemplateSessionKey(templateId: string) {
  return `${ACTIVE_TEMPLATE_SESSION_KEY_PREFIX}${templateId}`;
}

export function saveWorkoutSession(session: WorkoutSession): void {
  if (typeof window === "undefined") return;

  const payload: WorkoutSessionRecord = {
    session,
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(getSessionStorageKey(session.id), JSON.stringify(payload));
  localStorage.setItem(getActiveTemplateSessionKey(session.templateId), session.id);
}

export function loadWorkoutSession(
  sessionId: string
): WorkoutSessionRecord | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(getSessionStorageKey(sessionId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as WorkoutSessionRecord;
  } catch {
    return null;
  }
}

export function loadActiveWorkoutSessionForTemplate(
  templateId: string
): WorkoutSessionRecord | null {
  if (typeof window === "undefined") return null;

  const activeSessionId = localStorage.getItem(
    getActiveTemplateSessionKey(templateId)
  );

  if (!activeSessionId) return null;

  return loadWorkoutSession(activeSessionId);
}

export function clearWorkoutSession(sessionId: string, templateId?: string): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(getSessionStorageKey(sessionId));

  if (templateId) {
    const activeSessionId = localStorage.getItem(
      getActiveTemplateSessionKey(templateId)
    );

    if (activeSessionId === sessionId) {
      localStorage.removeItem(getActiveTemplateSessionKey(templateId));
    }
  }
}

export function loadAllWorkoutSessions(): WorkoutSessionRecord[] {
  if (typeof window === "undefined") return [];

  const sessions: WorkoutSessionRecord[] = [];

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(SESSION_KEY_PREFIX)) continue;

    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw) as WorkoutSessionRecord;
      sessions.push(parsed);
    } catch {
      continue;
    }
  }

  return sessions.sort(
    (a, b) =>
      new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}