export type SetEntry = {
  id: string;
  reps: number | undefined;
  weight: number | undefined;
  completed: boolean;
};

export type PreviousBest = {
  reps: number;
  weight: number;
};

export type ExerciseTemplate = {
  id: string;
  name: string;
  muscleGroup: string;
  previousBest?: PreviousBest;
  defaultSets: SetEntry[];
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  exercises: ExerciseTemplate[];
};

export type SessionExercise = {
  id: string;
  templateExerciseId?: string;
  name: string;
  muscleGroup: string;
  previousBest?: PreviousBest;
  sets: SetEntry[];
  isCompleted?: boolean;
};

export type WorkoutSessionStatus = "draft" | "completed";

export type WorkoutSession = {
  id: string;
  templateId: string;
  templateName: string;
  performedAt: string;
  status: WorkoutSessionStatus;
  exercises: SessionExercise[];
  createdAt: string;
  updatedAt: string;
};

export type WorkoutSessionRecord = {
  session: WorkoutSession;
  savedAt: string;
};