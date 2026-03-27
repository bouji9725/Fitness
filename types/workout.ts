export type SetEntry = {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
};

export type PreviousBest = {
  reps: number;
  weight: number;
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  sets: SetEntry[];
  previousBest?: PreviousBest;
};

export type WorkoutDay = {
  id: string;
  name: string;
  date: string;
  exercises: Exercise[];
};