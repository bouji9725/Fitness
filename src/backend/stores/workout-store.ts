import { workoutTemplates } from "@backend/data/workout-templates";
import {
  createWorkoutSessionFromTemplate,
  touchWorkoutSession,
} from "@shared/services/workout-session-service";
import { prisma } from "@backend/prisma/prisma";
import { createId } from "@shared/utils/create-id";
import type {
  ExerciseTemplate,
  SessionExercise,
  WorkoutSession,
  WorkoutSessionRecord,
  WorkoutTemplate,
} from "@shared/types/workout";

// ── Prisma include clause used everywhere a full session is needed ─────────
const SESSION_INCLUDE = {
  exercises: {
    orderBy: { order: "asc" as const },
    include: {
      sets: { orderBy: { order: "asc" as const } },
    },
  },
} as const;

type SessionRow = Awaited<
  ReturnType<typeof prisma.workoutSession.findFirst<{ include: typeof SESSION_INCLUDE }>>
>;

// ── Map a Prisma row → WorkoutSession ──────────────────────────────────────
function rowToSession(row: NonNullable<SessionRow>): WorkoutSession {
  return {
    id: row.id,
    templateId: row.templateId,
    templateName: row.templateName,
    performedAt: row.performedAt,
    status: row.status as WorkoutSession["status"],
    exercises: row.exercises.map((ex) => ({
      id: ex.id,
      templateExerciseId: ex.templateExerciseId ?? undefined,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      isCompleted: ex.isCompleted,
      previousBest:
        ex.previousBestReps != null && ex.previousBestWeight != null
          ? { reps: ex.previousBestReps, weight: ex.previousBestWeight }
          : undefined,
      sets: ex.sets.map((s) => ({
        id: s.id,
        reps: s.reps ?? undefined,
        weight: s.weight ?? undefined,
        completed: s.completed,
      })),
    })),
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ── Map SessionExercise[] → Prisma nested create data ─────────────────────
function toExerciseCreateData(exercises: SessionExercise[]) {
  return exercises.map((ex, exIdx) => ({
    id: ex.id,
    templateExerciseId: ex.templateExerciseId ?? null,
    name: ex.name,
    muscleGroup: ex.muscleGroup,
    isCompleted: ex.isCompleted ?? false,
    previousBestReps: ex.previousBest?.reps ?? null,
    previousBestWeight: ex.previousBest?.weight ?? null,
    order: exIdx,
    sets: {
      create: ex.sets.map((set, setIdx) => ({
        id: set.id,
        reps: set.reps ?? null,
        weight: set.weight ?? null,
        completed: set.completed,
        order: setIdx,
      })),
    },
  }));
}

export type SessionsPage = {
  data: WorkoutSessionRecord[];
  total: number;
};

export const workoutStore = {
  listTemplates(): WorkoutTemplate[] {
    return workoutTemplates;
  },

  getTemplateById(templateId: string): WorkoutTemplate | null {
    return workoutTemplates.find((t) => t.id === templateId) ?? null;
  },

  async listUserTemplates(userId: string): Promise<WorkoutTemplate[]> {
    const rows = await prisma.userWorkoutTemplate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      exercises: JSON.parse(r.exercises) as ExerciseTemplate[],
      isCustom: true,
    }));
  },

  async createUserTemplate(
    userId: string,
    name: string,
    exercises: ExerciseTemplate[]
  ): Promise<WorkoutTemplate> {
    const id = createId("tpl");
    const createdAt = new Date().toISOString();
    await prisma.userWorkoutTemplate.create({
      data: { id, userId, name, exercises: JSON.stringify(exercises), createdAt },
    });
    return { id, name, exercises, isCustom: true };
  },

  async updateUserTemplate(
    userId: string,
    id: string,
    name: string,
    exercises: ExerciseTemplate[]
  ): Promise<WorkoutTemplate | null> {
    const existing = await prisma.userWorkoutTemplate.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existing) return null;
    await prisma.userWorkoutTemplate.update({
      where: { id },
      data: { name, exercises: JSON.stringify(exercises) },
    });
    return { id, name, exercises, isCustom: true };
  },

  async deleteUserTemplate(userId: string, id: string): Promise<boolean> {
    const existing = await prisma.userWorkoutTemplate.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!existing) return false;
    await prisma.userWorkoutTemplate.delete({ where: { id } });
    return true;
  },

  async getUserTemplateById(userId: string, id: string): Promise<WorkoutTemplate | null> {
    const row = await prisma.userWorkoutTemplate.findFirst({ where: { id, userId } });
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      exercises: JSON.parse(row.exercises) as ExerciseTemplate[],
      isCustom: true,
    };
  },

  async createCustomSession(userId: string, name: string): Promise<WorkoutSession> {
    const now = new Date().toISOString();
    const sessionId = `session-${crypto.randomUUID()}`;

    await prisma.workoutSession.create({
      data: {
        id: sessionId,
        userId,
        templateId: "custom",
        templateName: name,
        performedAt: now,
        status: "draft",
        createdAt: now,
        updatedAt: now,
      },
    });

    return {
      id: sessionId,
      templateId: "custom",
      templateName: name,
      performedAt: now,
      status: "draft",
      exercises: [],
      createdAt: now,
      updatedAt: now,
    };
  },

  async createSession(userId: string, templateId: string): Promise<WorkoutSession | null> {
    const template =
      this.getTemplateById(templateId) ??
      (await this.getUserTemplateById(userId, templateId));
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
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        exercises: { create: toExerciseCreateData(session.exercises) },
      },
    });

    return session;
  },

  async getSession(userId: string, sessionId: string): Promise<WorkoutSession | null> {
    const row = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
      include: SESSION_INCLUDE,
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

    // Delete existing exercises — sets cascade via onDelete: Cascade
    await prisma.workoutSessionExercise.deleteMany({ where: { sessionId } });

    await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        status: nextSession.status,
        notes: session.notes ?? null,
        updatedAt: nextSession.updatedAt,
        exercises: { create: toExerciseCreateData(nextSession.exercises) },
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
      include: SESSION_INCLUDE,
    });
    return rows.map(rowToSession);
  },

  async listSavedSessions(
    userId: string,
    options?: { limit?: number; offset?: number }
  ): Promise<SessionsPage> {
    const [records, total] = await Promise.all([
      prisma.workoutSessionRecord.findMany({
        where: { session: { userId } },
        include: {
          session: { include: SESSION_INCLUDE },
        },
        orderBy: { savedAt: "desc" },
        take: options?.limit,
        skip: options?.offset ?? 0,
      }),
      prisma.workoutSessionRecord.count({
        where: { session: { userId } },
      }),
    ]);

    return {
      data: records.map((record) => ({
        session: rowToSession(record.session),
        savedAt: record.savedAt,
      })),
      total,
    };
  },

  async hasSessionForDate(userId: string, date: string): Promise<boolean> {
    const count = await prisma.workoutSession.count({
      where: { userId, performedAt: { startsWith: date } },
    });
    return count > 0;
  },

  async deleteSession(userId: string, sessionId: string): Promise<boolean> {
    const exists = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
      select: { id: true },
    });
    if (!exists) return false;

    // Deleting the session cascades to WorkoutSessionRecord,
    // WorkoutSessionExercise, and WorkoutSet.
    await prisma.workoutSession.delete({ where: { id: sessionId } });
    return true;
  },
};
