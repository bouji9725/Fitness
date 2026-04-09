
import { NextResponse } from "next/server";
import { saveWorkoutSession } from "@/lib/data/workouts";
import { loadWorkoutSession } from "@/lib/data/workouts";

export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const record = loadWorkoutSession(params.sessionId);

  if (!record) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(record.session);
}
export async function PATCH(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  const body = await request.json();

  saveWorkoutSession(body);

  return NextResponse.json({ success: true });
}