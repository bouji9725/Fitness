import { describe, it, expect } from "vitest";
import { validateCreateWorkoutSessionPayload } from "../workout-validation";

describe("validateCreateWorkoutSessionPayload", () => {
  it("fails when body is null", () => {
    const result = validateCreateWorkoutSessionPayload(null);
    expect(result.ok).toBe(false);
  });

  it("fails when body is a primitive string", () => {
    const result = validateCreateWorkoutSessionPayload("push-day");
    expect(result.ok).toBe(false);
  });

  it("fails when body is an array", () => {
    const result = validateCreateWorkoutSessionPayload([]);
    expect(result.ok).toBe(false);
  });

  it("fails when templateId is absent", () => {
    const result = validateCreateWorkoutSessionPayload({});
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.message).toMatch(/templateId/i);
  });

  it("fails when templateId is an empty string", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: "" });
    expect(result.ok).toBe(false);
  });

  it("fails when templateId is whitespace-only", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: "   " });
    expect(result.ok).toBe(false);
  });

  it("fails when templateId is a number", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: 123 });
    expect(result.ok).toBe(false);
  });

  it("succeeds when templateId is a non-empty string", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: "push-day" });
    expect(result).toMatchObject({ ok: true, data: { templateId: "push-day" } });
  });

  it("ignores extra fields when templateId is valid", () => {
    const result = validateCreateWorkoutSessionPayload({
      templateId: "pull-day",
      extra: "ignored",
    });
    expect(result).toMatchObject({ ok: true, data: { templateId: "pull-day" } });
  });

  it("returns the exact templateId value", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: "full-body-blast" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.templateId).toBe("full-body-blast");
  });
});
