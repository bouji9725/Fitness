import { prisma } from "@backend/prisma/prisma";
import { createId } from "@shared/utils/create-id";
import type { ProgressPhotoEntry } from "@shared/types/progress";

function rowToEntry(row: {
  id: string;
  date: string;
  imageUrl: string;
  label: string | null;
}): ProgressPhotoEntry {
  return {
    id: row.id,
    date: row.date,
    imageUrl: row.imageUrl,
    label: row.label ?? undefined,
  };
}

export const progressPhotoStore = {
  async listEntries(userId: string): Promise<ProgressPhotoEntry[]> {
    const rows = await prisma.progressPhoto.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return rows.map(rowToEntry);
  },

  async addEntry(
    userId: string,
    data: Omit<ProgressPhotoEntry, "id">
  ): Promise<ProgressPhotoEntry> {
    const row = await prisma.progressPhoto.create({
      data: {
        id: createId("photo"),
        userId,
        date: data.date,
        imageUrl: data.imageUrl,
        label: data.label ?? null,
      },
    });
    return rowToEntry(row);
  },

  async deleteEntry(userId: string, id: string): Promise<boolean> {
    const exists = await prisma.progressPhoto.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!exists) return false;
    await prisma.progressPhoto.delete({ where: { id } });
    return true;
  },
};
