import { NextResponse } from "next/server";
import { workoutTemplates } from "@/lib/data/workout-templates";

export async function GET(
  request: Request,
  { params }: { params: { templateId: string } }
) {
  const template = workoutTemplates.find(
    (t) => t.id === params.templateId
  );

  if (!template) {
    return NextResponse.json(
      { error: "Template not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(template);
}