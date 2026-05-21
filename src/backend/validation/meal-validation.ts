import type { MealLogEntry, MealPreference, MealStructure, DayType } from "@shared/types/nutrition";

type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; details?: unknown };

const VALID_STRUCTURES = new Set<string>([
  "3-meals",
  "3-meals-1-snack",
  "3-meals-2-snacks",
  "2-meals-1-snack",
  "intermittent-fasting-16-8",
  "training-day-split",
  "rest-day-split",
]);

const VALID_DAY_TYPES = new Set<string>(["training", "rest"]);
const HHMM_RE = /^\d{2}:\d{2}$/;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNonNegativeNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0;
}

export function validateMealPreferencePayload(
  body: unknown
): ValidationResult<MealPreference> {
  if (!isRecord(body)) {
    return { ok: false, message: "Request body must be a JSON object." };
  }

  if (!VALID_STRUCTURES.has(body.structure as string)) {
    return {
      ok: false,
      message: "structure must be one of the supported meal structures.",
      details: { field: "structure", received: body.structure },
    };
  }

  if (!VALID_DAY_TYPES.has(body.dayType as string)) {
    return {
      ok: false,
      message: 'dayType must be "training" or "rest".',
      details: { field: "dayType", received: body.dayType },
    };
  }

  if (
    body.workoutTime !== undefined &&
    body.workoutTime !== null &&
    !HHMM_RE.test(body.workoutTime as string)
  ) {
    return {
      ok: false,
      message: "workoutTime must be a HH:MM string.",
      details: { field: "workoutTime" },
    };
  }

  if (
    body.fastingWindowStart !== undefined &&
    body.fastingWindowStart !== null &&
    !HHMM_RE.test(body.fastingWindowStart as string)
  ) {
    return {
      ok: false,
      message: "fastingWindowStart must be a HH:MM string.",
      details: { field: "fastingWindowStart" },
    };
  }

  return {
    ok: true,
    data: {
      structure: body.structure as MealStructure,
      dayType: body.dayType as DayType,
      workoutTime: (body.workoutTime as string | undefined) ?? undefined,
      fastingWindowStart: (body.fastingWindowStart as string | undefined) ?? undefined,
    },
  };
}

export type MealLogPayload = Omit<MealLogEntry, "id">;

export function validateMealLogPayload(
  body: unknown
): ValidationResult<MealLogPayload> {
  if (!isRecord(body)) {
    return { ok: false, message: "Request body must be a JSON object." };
  }

  if (typeof body.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    return {
      ok: false,
      message: "date must be a YYYY-MM-DD string.",
      details: { field: "date" },
    };
  }

  if (
    typeof body.slotIndex !== "number" ||
    !Number.isInteger(body.slotIndex) ||
    body.slotIndex < 0
  ) {
    return {
      ok: false,
      message: "slotIndex must be a non-negative integer.",
      details: { field: "slotIndex" },
    };
  }

  for (const field of ["calories", "proteinGrams", "carbsGrams", "fatGrams"] as const) {
    if (!isNonNegativeNumber(body[field])) {
      return {
        ok: false,
        message: `${field} must be a non-negative number.`,
        details: { field },
      };
    }
  }

  if (body.notes !== undefined && body.notes !== null && typeof body.notes !== "string") {
    return {
      ok: false,
      message: "notes must be a string.",
      details: { field: "notes" },
    };
  }

  return {
    ok: true,
    data: {
      date: body.date as string,
      slotIndex: body.slotIndex as number,
      calories: body.calories as number,
      proteinGrams: body.proteinGrams as number,
      carbsGrams: body.carbsGrams as number,
      fatGrams: body.fatGrams as number,
      notes: (body.notes as string | undefined) ?? undefined,
    },
  };
}
