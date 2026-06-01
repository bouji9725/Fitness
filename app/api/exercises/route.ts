import { NextRequest } from "next/server";
import { getAuthUserId } from "@backend/auth/session";
import { prisma } from "@backend/prisma/prisma";
import {
  apiSuccessResponse,
  apiErrorResponse,
} from "@backend/responses/api-response";
import type { ExerciseCatalogEntry } from "@shared/types/workout";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export async function GET(req: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return apiErrorResponse({ status: 401, message: "Unauthorized." });

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const muscle = searchParams.get("muscle")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const level = searchParams.get("level")?.trim() ?? "";

  const rawLimit = parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const rawOffset = parseInt(searchParams.get("offset") ?? "0", 10);

  if (isNaN(rawLimit) || isNaN(rawOffset) || rawLimit < 1 || rawOffset < 0) {
    return apiErrorResponse({ status: 400, message: "Invalid limit or offset." });
  }

  const limit = Math.min(rawLimit, MAX_LIMIT);
  const offset = rawOffset;

  const where = {
    ...(search && { name: { contains: search, mode: "insensitive" as const } }),
    ...(muscle && { muscleGroupTag: muscle }),
    ...(category && { category }),
    ...(level && { level }),
  };

  const [rows, total] = await Promise.all([
    prisma.exerciseLibrary.findMany({
      where,
      select: {
        id: true,
        name: true,
        muscleGroupTag: true,
        category: true,
        level: true,
        equipment: true,
        force: true,
        mechanic: true,
      },
      orderBy: { name: "asc" },
      take: limit,
      skip: offset,
    }),
    prisma.exerciseLibrary.count({ where }),
  ]);

  const data: ExerciseCatalogEntry[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    muscleGroup: r.muscleGroupTag,
    category: r.category,
    level: r.level,
    equipment: r.equipment,
    force: r.force,
    mechanic: r.mechanic,
  }));

  return apiSuccessResponse({ data, total });
}
