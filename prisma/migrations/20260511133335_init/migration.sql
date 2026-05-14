-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL DEFAULT 'user-1',
    "name" TEXT NOT NULL DEFAULT '',
    "age" INTEGER,
    "heightCm" DOUBLE PRECISION,
    "goal" TEXT,
    "coachSharingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "coachName" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyStatsEntry" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "bodyFatPercent" DOUBLE PRECISION NOT NULL,
    "muscleMassKg" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "BodyStatsEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionSummary" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "fatFreeMassKg" DOUBLE PRECISION NOT NULL,
    "fatFreeMassLbs" DOUBLE PRECISION NOT NULL,
    "proteinFactor" DOUBLE PRECISION NOT NULL,
    "proteinTargetGrams" DOUBLE PRECISION NOT NULL,
    "calorieTarget" DOUBLE PRECISION NOT NULL,
    "fatPercent" DOUBLE PRECISION NOT NULL,
    "fatTargetGrams" DOUBLE PRECISION NOT NULL,
    "carbsTargetGrams" DOUBLE PRECISION NOT NULL,
    "proteinCalories" DOUBLE PRECISION NOT NULL,
    "fatCalories" DOUBLE PRECISION NOT NULL,
    "carbCalories" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "NutritionSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "performedAt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "exercises" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSessionRecord" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "savedAt" TEXT NOT NULL,

    CONSTRAINT "WorkoutSessionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSessionRecord_sessionId_key" ON "WorkoutSessionRecord"("sessionId");

-- AddForeignKey
ALTER TABLE "WorkoutSessionRecord" ADD CONSTRAINT "WorkoutSessionRecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
