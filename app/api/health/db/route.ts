import { NextResponse } from "next/server";
import { prisma } from "@backend/prisma/prisma";

export async function GET() {
  try {
    const userProfileCount = await prisma.userProfile.count();
    const workoutSessionCount = await prisma.workoutSession.count();

    return NextResponse.json({
      ok: true,
      database: "connected",
      provider: "postgresql",
      counts: {
        userProfiles: userProfileCount,
        workoutSessions: workoutSessionCount,
      },
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
        provider: "postgresql",
        message: "Database query failed.",
      },
      { status: 500 }
    );
  }
}
