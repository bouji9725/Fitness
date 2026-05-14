import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

type PrismaInstance = ReturnType<typeof createPrismaClient>;

declare global {
  // Singleton across hot-reloads in development.
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaInstance | undefined;
}

export const prisma: PrismaInstance =
  globalThis.__prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prismaClient = prisma;
}
