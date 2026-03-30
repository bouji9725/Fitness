export type BodyStatsEntry = {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
  muscleMassKg?: number;
  notes?: string;
};

export type ProgressPhotoEntry = {
  id: string;
  date: string;
  imageUrl: string;
  label?: string;
};

export type InBodyEntry = {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
  skeletalMuscleMassKg?: number;
  fatFreeMassKg?: number;
  notes?: string;
};