import type {
  ExerciseTemplate,
  SessionExercise,
  SetEntry,
  WorkoutSession,
  WorkoutTemplate,
} from "@/types/workout";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function cloneSet(set: SetEntry): SetEntry {
  return {
    id: createId("set"),
    reps: set.reps,
    weight: set.weight,
    completed: false,
  };
}

function createSessionExercise(exercise: ExerciseTemplate): SessionExercise {
  return {
    id: createId("session-exercise"),
    templateExerciseId: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup,
    previousBest: exercise.previousBest,
    isCompleted: false,
    sets: exercise.defaultSets.map(cloneSet),
  };
}

export function createWorkoutSessionFromTemplate(
  template: WorkoutTemplate
): WorkoutSession {
  const now = new Date().toISOString();

  return {
    id: createId("session"),
    templateId: template.id,
    templateName: template.name,
    performedAt: now,
    status: "draft",
    exercises: template.exercises.map(createSessionExercise),
    createdAt: now,
    updatedAt: now,
  };
}

export function touchWorkoutSession(session: WorkoutSession): WorkoutSession {
  return {
    ...session,
    updatedAt: new Date().toISOString(),
  };
}

export function resetWorkoutSessionFromTemplate(
  session: WorkoutSession,
  template: WorkoutTemplate
): WorkoutSession {
  const now = new Date().toISOString();

  return {
    ...session,
    templateId: template.id,
    templateName: template.name,
    performedAt: now,
    status: "draft",
    exercises: template.exercises.map(createSessionExercise),
    updatedAt: now,
  };
}

export function completeWorkoutSession(
  session: WorkoutSession
): WorkoutSession {
  return {
    ...session,
    status: "completed",
    updatedAt: new Date().toISOString(),
  };
}