-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'user-1',
    "name" TEXT NOT NULL DEFAULT '',
    "age" INTEGER,
    "heightCm" REAL,
    "goal" TEXT,
    "coachSharingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "coachName" TEXT
);

-- CreateTable
CREATE TABLE "BodyStatsEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "weightKg" REAL NOT NULL,
    "bodyFatPercent" REAL NOT NULL,
    "muscleMassKg" REAL,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "NutritionSummary" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "fatFreeMassKg" REAL NOT NULL,
    "fatFreeMassLbs" REAL NOT NULL,
    "proteinFactor" REAL NOT NULL,
    "proteinTargetGrams" REAL NOT NULL,
    "calorieTarget" REAL NOT NULL,
    "fatPercent" REAL NOT NULL,
    "fatTargetGrams" REAL NOT NULL,
    "carbsTargetGrams" REAL NOT NULL,
    "proteinCalories" REAL NOT NULL,
    "fatCalories" REAL NOT NULL,
    "carbCalories" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "templateId" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "performedAt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "exercises" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "WorkoutSessionRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "savedAt" TEXT NOT NULL,
    CONSTRAINT "WorkoutSessionRecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSessionRecord_sessionId_key" ON "WorkoutSessionRecord"("sessionId");
