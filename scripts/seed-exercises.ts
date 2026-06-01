import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { toMuscleGroupTag } from "./lib/muscle-map";
import * as dotenv from "dotenv";
import exercisesJson from "../data/exercises/exercises.json";

dotenv.config({ path: ".env" });

type RawExercise = {
  id: string;
  name: string;
  category: string;
  level: string;
  equipment: string | null;
  force: string | null;
  mechanic: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  images: string[];
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const raw = exercisesJson as RawExercise[];

  const data = raw.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category,
    level: e.level,
    equipment: e.equipment ?? null,
    force: e.force ?? null,
    mechanic: e.mechanic ?? null,
    primaryMuscles: e.primaryMuscles,
    secondaryMuscles: e.secondaryMuscles,
    muscleGroupTag: toMuscleGroupTag(e.primaryMuscles),
    instructions: e.instructions,
    images: e.images,
  }));

  const result = await prisma.exerciseLibrary.createMany({
    data,
    skipDuplicates: true,
  });

  const skipped = data.length - result.count;
  console.log(`✓ Seeded ${result.count} exercises (${skipped} skipped as duplicates)`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect().finally(() => pool.end()));
