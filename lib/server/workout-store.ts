import { workoutTemplates } from "@/lib/data/workout-templates";
import {
  createWorkoutSessionFromTemplate,
  touchWorkoutSession,
} from "@/lib/services/workout-session-service";
import { prisma } from "./prisma";
import type {
  WorkoutSession,
  WorkoutSessionRecord,
  WorkoutTemplate,
} from "@/types/workout";

function serializeExercises(session: WorkoutSession): string {
  return JSON.stringify(session.exercises);
}

function rowToSession(row: {
  id: string;
  templateId: string;
  templateName: string;
  performedAt: string;
  status: string;
  exercises: string;
  createdAt: string;
  updatedAt: string;
}): WorkoutSession {
  return {
    id: row.id,
    templateId: row.templateId,
    templateName: row.templateName,
    performedAt: row.performedAt,
    status: row.status as WorkoutSession["status"],
    exercises: JSON.parse(row.exercises),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const workoutStore = {
  // Template methods stay synchronous — static seed data, no DB needed.
  listTemplates(): WorkoutTemplate[] {
    return workoutTemplates;
  },

  getTemplateById(templateId: string): WorkoutTemplate | null {
    return workoutTemplates.find((t) => t.id === templateId) ?? null;
  },

  async createSession(templateId: string): Promise<WorkoutSession | null> {
    const template = this.getTemplateById(templateId);
    if (!template) return null;

    const session = createWorkoutSessionFromTemplate(template);

    await prisma.workoutSession.create({
      data: {
        id: session.id,
        templateId: session.templateId,
        templateName: session.templateName,
        performedAt: session.performedAt,
        status: session.status,
        exercises: serializeExercises(session),
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });

    return session;
  },

  async getSession(sessionId: string): Promise<WorkoutSession | null> {
    const row = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    return row ? rowToSession(row) : null;
  },

  async saveSession(
    sessionId: string,
    session: WorkoutSession
  ): Promise<WorkoutSessionRecord | null> {
    const exists = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
      select: { id: true },
    });

    if (!exists) return null;

    const nextSession = touchWorkoutSession({ ...session, id: sessionId });
    const savedAt = new Date().toISOString();

    await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        status: nextSession.status,
        exercises: serializeExercises(nextSession),
        updatedAt: nextSession.updatedAt,
      },
    });

    await prisma.workoutSessionRecord.upsert({
      where: { sessionId },
      create: { sessionId, savedAt },
      update: { savedAt },
    });

    return { session: nextSession, savedAt };
  },

  async listSavedSessions(): Promise<WorkoutSessionRecord[]> {
    const records = await prisma.workoutSessionRecord.findMany({
      include: { session: true },
      orderBy: { savedAt: "desc" },
    });

    return records.map((record) => ({
      session: rowToSession(record.session),
      savedAt: record.savedAt,
    }));
  },
};
