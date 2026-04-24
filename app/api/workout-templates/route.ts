import { NextResponse } from "next/server";
import { workoutStore } from "@/lib/server/workout-store";

// GET /api/workout-templates
// Returns all available workout templates.
export async function GET() {
  return NextResponse.json(workoutStore.listTemplates());
}