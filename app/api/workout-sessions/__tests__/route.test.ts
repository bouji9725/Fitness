// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@backend/auth/session", () => ({
  getAuthUserId: vi.fn(),
}));

vi.mock("@backend/stores/workout-store", () => ({
  workoutStore: {
    createSession: vi.fn(),
    createCustomSession: vi.fn(),
    listSavedSessions: vi.fn(),
    listActiveSessions: vi.fn(),
    hasSessionForDate: vi.fn(),
  },
}));

import { GET, POST } from "../route";
import { getAuthUserId } from "@backend/auth/session";
import { workoutStore } from "@backend/stores/workout-store";
import type { WorkoutSession } from "@shared/types/workout";

function postRequest(body: unknown) {
  return new Request("http://localhost/api/workout-sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequest(params = "") {
  return new Request(`http://localhost/api/workout-sessions${params}`);
}

describe("POST /api/workout-sessions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue(null);
    const res = await POST(postRequest({ templateId: "push-day" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 when body has neither templateId nor name", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("user-1");
    const res = await POST(postRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error.message).toBe("Validation failed");
    expect(json.error.details).toBeDefined();
  });

  it("returns 400 when body is not an object", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("user-1");
    const res = await POST(postRequest("not-an-object"));
    expect(res.status).toBe(400);
  });

  it("returns 404 when the template does not exist", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("user-1");
    vi.mocked(workoutStore.createSession).mockResolvedValue(null);
    const res = await POST(postRequest({ templateId: "nonexistent-template" }));
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error.details?.templateId).toBe("nonexistent-template");
  });

  it("returns 201 with the created session when templateId is valid", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("user-1");
    const fakeSession: Partial<WorkoutSession> = {
      id: "sess-abc",
      templateId: "push-day",
      templateName: "Push Day",
      status: "draft",
      exercises: [],
    };
    vi.mocked(workoutStore.createSession).mockResolvedValue(
      fakeSession as WorkoutSession
    );
    const res = await POST(postRequest({ templateId: "push-day" }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.id).toBe("sess-abc");
    expect(json.templateId).toBe("push-day");
  });

  it("returns 201 with a custom session when name is provided", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("user-1");
    const fakeSession: Partial<WorkoutSession> = {
      id: "sess-custom",
      templateName: "My Session",
      status: "draft",
      exercises: [],
    };
    vi.mocked(workoutStore.createCustomSession).mockResolvedValue(
      fakeSession as WorkoutSession
    );
    const res = await POST(postRequest({ name: "My Session" }));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.id).toBe("sess-custom");
  });
});

describe("GET /api/workout-sessions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue(null);
    const res = await GET(getRequest());
    expect(res.status).toBe(401);
  });

  it("returns 200 with a paginated list of saved sessions", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("user-1");
    vi.mocked(workoutStore.listSavedSessions).mockResolvedValue({
      data: [],
      total: 0,
    });
    const res = await GET(getRequest());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("data");
    expect(json).toHaveProperty("total");
  });

  it("returns 400 for a malformed ?date= param", async () => {
    vi.mocked(getAuthUserId).mockResolvedValue("user-1");
    const res = await GET(getRequest("?date=not-a-date"));
    expect(res.status).toBe(400);
  });
});
