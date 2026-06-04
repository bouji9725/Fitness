import { z } from "zod";

// ── Auth ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ── Profile ─────────────────────────────────────────────────────────────────
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  sex: z.enum(["male", "female"]).optional(),
  age: z.number().int().positive("Age must be positive").max(150).optional(),
  heightCm: z.number().positive("Height must be positive").max(300).optional(),
  goal: z.enum(["lose-weight", "gain-muscle", "body-recomp", "maintenance"]).optional(),
  coachSharingEnabled: z.boolean().default(false),
  coachName: z.string().max(255).optional(),
});

// ── Progress ────────────────────────────────────────────────────────────────
export const progressEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  weightKg: z.number().positive("Weight must be positive"),
  bodyFatPercent: z.number().min(0, "Body fat % must be 0 or higher").max(100),
  muscleMassKg: z.number().positive("Muscle mass must be positive").optional(),
  notes: z.string().max(2000).optional(),
});

export const inbodyEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  weightKg: z.number().positive("Weight must be positive"),
  bodyFatPercent: z.number().min(0, "Body fat % must be 0 or higher").max(100),
  skeletalMuscleMassKg: z.number().positive().optional(),
  fatFreeMassKg: z.number().positive().optional(),
  notes: z.string().max(2000).optional(),
});

export const progressPhotoSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  imageUrl: z.string().url("Invalid image URL"),
  label: z.string().max(255).optional(),
});

// ── Nutrition ───────────────────────────────────────────────────────────────
export const nutritionSummarySchema = z.object({
  fatFreeMassKg: z.number().positive("Fat-free mass must be positive"),
  fatFreeMassLbs: z.number().positive("Fat-free mass must be positive"),
  proteinFactor: z.number().positive("Protein factor must be positive"),
  proteinTargetGrams: z.number().positive("Protein target must be positive"),
  calorieTarget: z.number().positive("Calorie target must be positive"),
  fatPercent: z.number().min(0).max(100),
  fatTargetGrams: z.number().positive("Fat target must be positive"),
  carbsTargetGrams: z.number().positive("Carbs target must be positive"),
  proteinCalories: z.number().positive(),
  fatCalories: z.number().positive(),
  carbCalories: z.number().positive(),
});

export const mealPreferenceSchema = z.object({
  structure: z.enum(["3-meals", "3-meals-snacks", "fasting-16-8", "custom"]),
  dayType: z.enum(["weekday", "weekend", "all"]),
  workoutTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM").optional(),
  fastingWindowStart: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM").optional(),
});

export const mealLogEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  slotIndex: z.number().int().min(0),
  calories: z.number().min(0, "Calories must be 0 or higher"),
  proteinGrams: z.number().min(0),
  carbsGrams: z.number().min(0),
  fatGrams: z.number().min(0),
  notes: z.string().max(2000).optional(),
});

export const dailyTargetOverrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  calories: z.number().positive("Calories must be positive").optional(),
  proteinGrams: z.number().min(0).optional(),
  carbsGrams: z.number().min(0).optional(),
  fatGrams: z.number().min(0).optional(),
});

// ── Workouts ────────────────────────────────────────────────────────────────
export const createSessionSchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
}).or(z.object({
  name: z.string().min(1, "Session name is required"),
}));

// Existing validation from workout-validation.ts
export const sessionExerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Exercise name is required"),
  muscleGroup: z.string().min(1, "Muscle group is required"),
  sets: z.array(z.object({
    id: z.string(),
    reps: z.number().optional(),
    weight: z.number().optional(),
    completed: z.boolean(),
  })),
  isCompleted: z.boolean().optional(),
});

export const workoutSessionSchema = z.object({
  id: z.string(),
  templateId: z.string(),
  templateName: z.string(),
  performedAt: z.string(),
  status: z.enum(["draft", "completed"]),
  exercises: z.array(sessionExerciseSchema),
  notes: z.string().max(4000).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const userWorkoutTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(255),
  exercises: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    muscleGroup: z.string().min(1),
    defaultSets: z.array(z.object({
      id: z.string(),
      reps: z.number().optional(),
      weight: z.number().optional(),
      completed: z.boolean(),
    })),
  })),
});

// ── Type exports ────────────────────────────────────────────────────────────
export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;
export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
export type ProgressEntry = z.infer<typeof progressEntrySchema>;
export type NutritionSummary = z.infer<typeof nutritionSummarySchema>;
export type MealPreference = z.infer<typeof mealPreferenceSchema>;
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;
