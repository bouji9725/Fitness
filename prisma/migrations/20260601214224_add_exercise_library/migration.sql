-- CreateTable
CREATE TABLE "ExerciseLibrary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "force" TEXT,
    "mechanic" TEXT,
    "primaryMuscles" TEXT[],
    "secondaryMuscles" TEXT[],
    "muscleGroupTag" TEXT NOT NULL,
    "instructions" TEXT[],
    "images" TEXT[],

    CONSTRAINT "ExerciseLibrary_pkey" PRIMARY KEY ("id")
);
