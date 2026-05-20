import { workoutTemplates } from "@backend/data/workout-templates";
import {
  createWorkoutSessionFromTemplate,
  touchWorkoutSession,
} from "@shared/services/workout-session-service";
import { prisma } from "@backend/prisma/prisma";
import type {
  WorkoutSession,
  WorkoutSessionRecord,
  WorkoutTemplate,
} from "@shared/types/workout";

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
  listTemplates(): WorkoutTemplate[] {
    return workoutTemplates;
  },

  getTemplateById(templateId: string): WorkoutTemplate | null {
    return workoutTemplates.find((t) => t.id === templateId) ?? null;
  },

  async createSession(userId: string, templateId: string): Promise<WorkoutSession | null> {
    const template = this.getTemplateById(templateId);
    if (!template) return null;

    const session = createWorkoutSessionFromTemplate(template);

    await prisma.workoutSession.create({
      data: {
        id: session.id,
        userId,
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

  async getSession(userId: string, sessionId: string): Promise<WorkoutSession | null> {
    const row = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
    });

    return row ? rowToSession(row) : null;
  },

  async saveSession(
    userId: string,
    sessionId: string,
    session: WorkoutSession
  ): Promise<WorkoutSessionRecord | null> {
    const exists = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
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

  async listActiveSessions(userId: string): Promise<WorkoutSession[]> {
    const rows = await prisma.workoutSession.findMany({
      where: { userId, record: null },
      orderBy: { updatedAt: "desc" },
      take: 5,
    });
    return rows.map(rowToSession);
  },

  async listSavedSessions(userId: string): Promise<WorkoutSessionRecord[]> {
    const records = await prisma.workoutSessionRecord.findMany({
      where: { session: { userId } },
      include: { session: true },
      orderBy: { savedAt: "desc" },
    });

    return records.map((record) => ({
      session: rowToSession(record.session),
      savedAt: record.savedAt,
    }));
  },
};
