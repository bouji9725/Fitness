import { z } from "zod";

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: Record<string, string> };

/**
 * Safely validate data against a Zod schema.
 * Returns either { ok: true, data } or { ok: false, error, details }
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);
    if (result.success) {
      return { ok: true, data: result.data };
    }

    const details: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      details[path] = issue.message;
    }

    return {
      ok: false,
      error: "Validation failed",
      details,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown validation error",
    };
  }
}
