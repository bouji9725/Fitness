-- CreateTable
CREATE TABLE "MealPreference" (
    "id" TEXT NOT NULL,
    "structure" TEXT NOT NULL,
    "dayType" TEXT NOT NULL,
    "workoutTime" TEXT,
    "fastingWindowStart" TEXT,

    CONSTRAINT "MealPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealLogEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL,
    "proteinGrams" DOUBLE PRECISION NOT NULL,
    "carbsGrams" DOUBLE PRECISION NOT NULL,
    "fatGrams" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,

    CONSTRAINT "MealLogEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MealPreference" ADD CONSTRAINT "MealPreference_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLogEntry" ADD CONSTRAINT "MealLogEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
