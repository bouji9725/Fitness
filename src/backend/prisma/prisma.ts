import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

function createPrismaClient() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // DATABASE_URL points to Neon's PgBouncer pooler — it handles the
    // actual PostgreSQL connections. Keep our pool small: 5 in production
    // (serverless Vercel functions share the globalThis singleton within
    // a warm instance) and 2 in development so prisma generate reloads
    // don't exhaust Neon's connection limit.
    max: process.env.NODE_ENV === "production" ? 5 : 2,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

type PrismaInstance = ReturnType<typeof createPrismaClient>;

declare global {
  var __prismaClient: PrismaInstance | undefined;
}

// Production: persist the client in globalThis so it survives across
// Next.js route re-renders without spawning new connection pools.
//
// Development: skip globalThis so Turbopack re-evaluates this module
// (and creates a fresh client with new models) whenever `prisma generate`
// updates lib/generated/prisma/client.ts — no server restart needed.
export const prisma: PrismaInstance =
  process.env.NODE_ENV === "production"
    ? (globalThis.__prismaClient ??= createPrismaClient())
    : createPrismaClient();
