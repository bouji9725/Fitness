import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TEST_USER_ID = "cmp7er5c70000uwkj8pg5xton"; // from seed

async function main() {
  console.log("--- GET profile ---");
  const existing = await prisma.userProfile.findUnique({ where: { id: TEST_USER_ID } });
  console.log(JSON.stringify(existing, null, 2));

  console.log("\n--- UPSERT profile ---");
  const data = {
    name: "Test User",
    sex: "male",
    age: 28,
    heightCm: 180,
    goal: "gain-muscle",
    coachSharingEnabled: true,
    coachName: "Coach Bob",
  };

  const row = await prisma.userProfile.upsert({
    where: { id: TEST_USER_ID },
    create: { id: TEST_USER_ID, ...data },
    update: data,
  });
  console.log(JSON.stringify(row, null, 2));

  console.log("\n--- PROGRESS: list entries ---");
  const entries = await prisma.bodyStatsEntry.findMany({ where: { userId: TEST_USER_ID } });
  console.log(JSON.stringify(entries, null, 2));

  console.log("\n--- PROGRESS: create entry ---");
  const newEntry = await prisma.bodyStatsEntry.create({
    data: {
      id: `bse_test_${Date.now()}`,
      userId: TEST_USER_ID,
      date: "2026-05-15",
      weightKg: 82,
      bodyFatPercent: 16,
    },
  });
  console.log(JSON.stringify(newEntry, null, 2));
}

main()
  .catch((e) => { console.error("ERROR:", e.message); })
  .finally(() => prisma.$disconnect().then(() => pool.end()));
