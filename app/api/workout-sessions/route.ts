import { NextResponse } from "next/server";
import { workoutStore } from "@/lib/server/workout-store";

// GET /api/workout-sessions
// Returns saved workout session records.
export async function GET() {
  return NextResponse.json(workoutStore.listSavedSessions());
}

// POST /api/workout-sessions
// Creates a new draft session from a workout template.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.templateId !== "string") {
    return NextResponse.json(
      { error: "templateId is required." },
      { status: 400 }
    );
  }

  const session = workoutStore.createSession(body.templateId);

  if (!session) {
    return NextResponse.json(
      { error: "Workout template not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(session, { status: 201 });
}