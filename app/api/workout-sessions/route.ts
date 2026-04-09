import { NextResponse } from "next/server";
import { workoutTemplates } from "@/lib/data/workout-templates";
import { createWorkoutSessionFromTemplate } from "@/lib/services/workout-session-service";

export async function POST(request: Request) {
  const body = await request.json();

  const { templateId } = body;

  if (!templateId) {
    return NextResponse.json(
      { error: "templateId is required" },
      { status: 400 }
    );
  }

  const template = workoutTemplates.find(
    (t) => t.id === templateId
  );

  if (!template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  const session = createWorkoutSessionFromTemplate(template);

  return NextResponse.json(session, { status: 201 });
}