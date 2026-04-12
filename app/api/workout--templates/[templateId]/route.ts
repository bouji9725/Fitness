    import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { templateId: string } }
) {
  return NextResponse.json({
    ok: true,
    templateId: params.templateId,
  });
}