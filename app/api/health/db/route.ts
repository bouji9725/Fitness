import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

/**
 * GET /api/health/db
 *
 * Developer health check.
 * This proves that the Next.js API layer can talk to PostgreSQL through Prisma.
 */
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