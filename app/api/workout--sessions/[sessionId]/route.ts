import { NextResponse } from "next/server";
import {
  loadWorkoutSession,
  saveWorkoutSession,
} from "@/lib/data/workouts";
import type { WorkoutSession } from "@/types/workout";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { sessionId } = await params;

  const record = loadWorkoutSession(sessionId);

  if (!record) {
    return NextResponse.json(
      { error: "Workout session not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(record.session);
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const { sessionId } = await params;
  const body = (await request.json()) as WorkoutSession;

  if (!body) {
    return NextResponse.json(
      { error: "Missing workout session payload" },
      { status: 400 }
    );
  }

  if (body.id !== sessionId) {
    return NextResponse.json(
      {
        error: "Session id in request body does not match route parameter",
      },
      { status: 400 }
    );
  }

  saveWorkoutSession(body);

  return NextResponse.json({
    success: true,
    session: body,
  });
}