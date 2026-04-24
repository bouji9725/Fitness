import type { WorkoutSession } from "@/types/workout";

type ValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      message: string;
      details?: unknown;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

// Validates the create-session request body.
// We keep this intentionally lightweight until Zod is introduced.
export function validateCreateWorkoutSessionPayload(
  body: unknown
): ValidationResult<{ templateId: string }> {
  if (!isRecord(body)) {
    return {
      ok: false,
      message: "Request body must be a JSON object.",
    };
  }

  if (!isString(body.templateId)) {
    return {
      ok: false,
      message: "templateId is required and must be a non-empty string.",
      details: {
        field: "templateId",
      },
    };
  }

  return {
    ok: true,
    data: {
      templateId: body.templateId,
    },
  };
}

// Validates enough of the workout session payload to protect the API boundary.
// This is not full business validation yet; it prevents obviously invalid data.
export function validateWorkoutSessionPayload(
  body: unknown
): ValidationResult<WorkoutSession> {
  if (!isRecord(body)) {
    return {
      ok: false,
      message: "Workout session payload must be a JSON object.",
    };
  }

  const requiredStringFields = [
    "id",
    "templateId",
    "templateName",
    "performedAt",
    "status",
    "createdAt",
    "updatedAt",
  ];

  for (const field of requiredStringFields) {
    if (!isString(body[field])) {
      return {
        ok: false,
        message: `${field} is required and must be a non-empty string.`,
        details: { field },
      };
    }
  }

  if (!Array.isArray(body.exercises)) {
    return {
      ok: false,
      message: "exercises is required and must be an array.",
      details: { field: "exercises" },
    };
  }

  for (const [exerciseIndex, exercise] of body.exercises.entries()) {
    if (!isRecord(exercise)) {
      return {
        ok: false,
        message: "Each exercise must be an object.",
        details: { exerciseIndex },
      };
    }

    const requiredExerciseFields = ["id", "name", "muscleGroup"];

    for (const field of requiredExerciseFields) {
      if (!isString(exercise[field])) {
        return {
          ok: false,
          message: `Exercise ${field} is required and must be a non-empty string.`,
          details: { exerciseIndex, field },
        };
      }
    }

    if (!isBoolean(exercise.isCompleted)) {
      return {
        ok: false,
        message: "Exercise isCompleted must be a boolean.",
        details: { exerciseIndex, field: "isCompleted" },
      };
    }

    if (!Array.isArray(exercise.sets)) {
      return {
        ok: false,
        message: "Exercise sets must be an array.",
        details: { exerciseIndex, field: "sets" },
      };
    }

    for (const [setIndex, set] of exercise.sets.entries()) {
      if (!isRecord(set)) {
        return {
          ok: false,
          message: "Each set must be an object.",
          details: { exerciseIndex, setIndex },
        };
      }

      if (!isString(set.id)) {
        return {
          ok: false,
          message: "Set id is required and must be a non-empty string.",
          details: { exerciseIndex, setIndex, field: "id" },
        };
      }

      if (!isNumber(set.reps)) {
        return {
          ok: false,
          message: "Set reps must be a number.",
          details: { exerciseIndex, setIndex, field: "reps" },
        };
      }

      if (!isNumber(set.weight)) {
        return {
          ok: false,
          message: "Set weight must be a number.",
          details: { exerciseIndex, setIndex, field: "weight" },
        };
      }

      if (!isBoolean(set.completed)) {
        return {
          ok: false,
          message: "Set completed must be a boolean.",
          details: { exerciseIndex, setIndex, field: "completed" },
        };
      }
    }
  }

  return {
    ok: true,
    data: body as WorkoutSession,
  };
}