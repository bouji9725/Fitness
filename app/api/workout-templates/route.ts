import { NextResponse } from "next/server";
import { workoutTemplates } from "@/lib/data/workout-templates";

export async function GET() {
  return NextResponse.json(workoutTemplates);
}