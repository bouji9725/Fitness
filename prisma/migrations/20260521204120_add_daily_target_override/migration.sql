-- CreateTable
CREATE TABLE "DailyTargetOverride" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "calories" DOUBLE PRECISION,
    "proteinGrams" DOUBLE PRECISION,
    "carbsGrams" DOUBLE PRECISION,
    "fatGrams" DOUBLE PRECISION,

    CONSTRAINT "DailyTargetOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyTargetOverride_userId_date_key" ON "DailyTargetOverride"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyTargetOverride" ADD CONSTRAINT "DailyTargetOverride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
