import { NextResponse } from "next/server";
import { workoutTemplates } from "@/lib/data/workout-templates";

type RouteContext = {
  params: Promise<{ templateId: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { templateId } = await params;

  const template = workoutTemplates.find((item) => item.id === templateId);

  if (!template) {
    return NextResponse.json(
      { error: "Workout template not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(template);
}