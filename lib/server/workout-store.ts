import { workoutTemplates } from "@/lib/data/workout-templates";
import {
  createWorkoutSessionFromTemplate,
  touchWorkoutSession,
} from "@/lib/services/workout-session-service";
import type {
  WorkoutSession,
  WorkoutSessionRecord,
  WorkoutTemplate,
} from "@/types/workout";

type WorkoutStoreState = {
  sessions: Map<string, WorkoutSession>;
  savedRecords: Map<string, WorkoutSessionRecord>;
};

declare global {
  // Keeps the temporary store stable during local development hot reloads.
  // This is intentionally temporary and will be replaced by Prisma/database later.
  // eslint-disable-next-line no-var
  var __fitnessWorkoutStore: WorkoutStoreState | undefined;
}

function getStore(): WorkoutStoreState {
  if (!globalThis.__fitnessWorkoutStore) {
    globalThis.__fitnessWorkoutStore = {
      sessions: new Map<string, WorkoutSession>(),
      savedRecords: new Map<string, WorkoutSessionRecord>(),
    };
  }

  return globalThis.__fitnessWorkoutStore;
}

// Temporary server-side workout store.
// This gives the frontend a real API boundary before database integration.
export const workoutStore = {
  listTemplates(): WorkoutTemplate[] {
    return workoutTemplates;
  },

  getTemplateById(templateId: string): WorkoutTemplate | null {
    return workoutTemplates.find((template) => template.id === templateId) ?? null;
  },

  createSession(templateId: string): WorkoutSession | null {
    const template = this.getTemplateById(templateId);

    if (!template) {
      return null;
    }

    const session = createWorkoutSessionFromTemplate(template);
    const store = getStore();

    store.sessions.set(session.id, session);

    return session;
  },

  getSession(sessionId: string): WorkoutSession | null {
    const store = getStore();

    return (
      store.sessions.get(sessionId) ??
      store.savedRecords.get(sessionId)?.session ??
      null
    );
  },

  saveSession(sessionId: string, session: WorkoutSession): WorkoutSessionRecord | null {
    const existingSession = this.getSession(sessionId);

    if (!existingSession) {
      return null;
    }

    const nextSession = touchWorkoutSession({
      ...session,
      id: sessionId,
    });

    const record: WorkoutSessionRecord = {
      session: nextSession,
      savedAt: new Date().toISOString(),
    };

    const store = getStore();

    store.sessions.set(sessionId, nextSession);
    store.savedRecords.set(sessionId, record);

    return record;
  },

  listSavedSessions(): WorkoutSessionRecord[] {
    const store = getStore();

    return Array.from(store.savedRecords.values()).sort((a, b) => {
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });
  },
};