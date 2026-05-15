-- Clear pre-auth data that has no matching User rows.
-- WorkoutSessionRecord must be deleted before WorkoutSession (FK dependency).
DELETE FROM "WorkoutSessionRecord";
DELETE FROM "WorkoutSession";
DELETE FROM "BodyStatsEntry";
DELETE FROM "UserProfile";
DELETE FROM "NutritionSummary";

-- AlterTable
ALTER TABLE "BodyStatsEntry" ADD COLUMN "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NutritionSummary" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WorkoutSession" ADD COLUMN "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyStatsEntry" ADD CONSTRAINT "BodyStatsEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionSummary" ADD CONSTRAINT "NutritionSummary_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
