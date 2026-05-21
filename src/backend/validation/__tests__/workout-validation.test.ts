import { describe, it, expect } from "vitest";
import { validateCreateWorkoutSessionPayload } from "../workout-validation";

describe("validateCreateWorkoutSessionPayload", () => {
  it("fails when body is null", () => {
    const result = validateCreateWorkoutSessionPayload(null);
    expect(result.ok).toBe(false);
  });

  it("fails when body is a primitive", () => {
    const result = validateCreateWorkoutSessionPayload("push-day");
    expect(result.ok).toBe(false);
  });

  it("fails when body is an array", () => {
    const result = validateCreateWorkoutSessionPayload([]);
    expect(result.ok).toBe(false);
  });

  it("returns kind=template when templateId is a non-empty string", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: "push-day" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.kind).toBe("template");
    expect((result.data as { kind: "template"; templateId: string }).templateId).toBe("push-day");
  });

  it("returns kind=custom when name is a non-empty string", () => {
    const result = validateCreateWorkoutSessionPayload({ name: "My Session" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.kind).toBe("custom");
    expect((result.data as { kind: "custom"; name: string }).name).toBe("My Session");
  });

  it("prefers templateId over name when both are present", () => {
    const result = validateCreateWorkoutSessionPayload({
      templateId: "push-day",
      name: "Ignored",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.kind).toBe("template");
  });

  it("fails when templateId is an empty string and name is absent", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: "" });
    expect(result.ok).toBe(false);
  });

  it("fails when templateId is whitespace-only and name is absent", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: "   " });
    expect(result.ok).toBe(false);
  });

  it("fails when templateId is a number", () => {
    const result = validateCreateWorkoutSessionPayload({ templateId: 123 });
    expect(result.ok).toBe(false);
  });

  it("fails when name is whitespace-only", () => {
    const result = validateCreateWorkoutSessionPayload({ name: "   " });
    expect(result.ok).toBe(false);
  });

  it("fails when body has neither templateId nor name", () => {
    const result = validateCreateWorkoutSessionPayload({});
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.message).toMatch(/templateId|name/i);
  });

  it("ignores extra fields when templateId is valid", () => {
    const result = validateCreateWorkoutSessionPayload({
      templateId: "pull-day",
      extra: "ignored",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.kind).toBe("template");
    expect((result.data as { kind: "template"; templateId: string }).templateId).toBe("pull-day");
  });
});
