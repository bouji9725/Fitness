import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TEST_EMAIL = "demo@fitsler.dev";
const TEST_PASSWORD = "demo1234";
const TEST_NAME = "Demo User";

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });

  if (existing) {
    console.log(`User already exists: ${TEST_EMAIL}`);
    return;
  }

  const hash = await bcrypt.hash(TEST_PASSWORD, 12);
  const user = await prisma.user.create({
    data: { email: TEST_EMAIL, passwordHash: hash, name: TEST_NAME },
  });

  console.log(`Created test user: ${user.email} (id: ${user.id})`);
  console.log(`Password: ${TEST_PASSWORD}`);
}

main()
  .catch((e) => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
