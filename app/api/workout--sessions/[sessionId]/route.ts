import { NextResponse } from "next/server";
import { workoutStore } from "@/lib/server/workout-store";
import type { WorkoutSession } from "@/types/workout";

type RouteContext = {
  params: Promise<{
    sessionId: string;
  }>;
};

// GET /api/workout-sessions/:sessionId
// Returns one workout session by id.
export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const session = workoutStore.getSession(sessionId);

  if (!session) {
    return NextResponse.json(
      { error: "Workout session not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(session);
}

// PATCH /api/workout-sessions/:sessionId
// Saves an updated workout session.
export async function PATCH(request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const body = (await request.json().catch(() => null)) as WorkoutSession | null;

  if (!body || typeof body.id !== "string") {
    return NextResponse.json(
      { error: "Valid workout session payload is required." },
      { status: 400 }
    );
  }

  if (body.id !== sessionId) {
    return NextResponse.json(
      { error: "Session id in URL and payload must match." },
      { status: 400 }
    );
  }

  const savedRecord = workoutStore.saveSession(sessionId, body);

  if (!savedRecord) {
    return NextResponse.json(
      { error: "Workout session not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(savedRecord);
}