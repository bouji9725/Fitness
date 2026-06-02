-- Replace WorkoutSession.exercises JSON blob with relational tables.
-- Existing session exercise data is dropped (development environment).

-- Drop JSON exercises column from WorkoutSession
ALTER TABLE "WorkoutSession" DROP COLUMN "exercises";

-- Add CASCADE to WorkoutSessionRecord so deleting a session also deletes its record
ALTER TABLE "WorkoutSessionRecord" DROP CONSTRAINT "WorkoutSessionRecord_sessionId_fkey";
ALTER TABLE "WorkoutSessionRecord" ADD CONSTRAINT "WorkoutSessionRecord_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- WorkoutSessionExercise table
CREATE TABLE "WorkoutSessionExercise" (
  "id"                 TEXT NOT NULL,
  "sessionId"          TEXT NOT NULL,
  "templateExerciseId" TEXT,
  "name"               TEXT NOT NULL,
  "muscleGroup"        TEXT NOT NULL,
  "isCompleted"        BOOLEAN NOT NULL DEFAULT false,
  "previousBestReps"   DOUBLE PRECISION,
  "previousBestWeight" DOUBLE PRECISION,
  "order"              INTEGER NOT NULL,
  CONSTRAINT "WorkoutSessionExercise_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "WorkoutSessionExercise" ADD CONSTRAINT "WorkoutSessionExercise_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- WorkoutSet table
CREATE TABLE "WorkoutSet" (
  "id"         TEXT NOT NULL,
  "exerciseId" TEXT NOT NULL,
  "reps"       INTEGER,
  "weight"     DOUBLE PRECISION,
  "completed"  BOOLEAN NOT NULL DEFAULT false,
  "order"      INTEGER NOT NULL,
  CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_exerciseId_fkey"
  FOREIGN KEY ("exerciseId") REFERENCES "WorkoutSessionExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
