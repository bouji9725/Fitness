-- CreateTable
CREATE TABLE "UserWorkoutTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exercises" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "UserWorkoutTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserWorkoutTemplate" ADD CONSTRAINT "UserWorkoutTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
