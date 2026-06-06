-- Replace WorkoutSession.exercises JSON blob with relational tables.
-- Existing session exercise data is dropped (development environment).

-- Drop JSON exercises column from WorkoutSession (if it exists)
ALTER TABLE "WorkoutSession" DROP COLUMN IF EXISTS "exercises";

-- Add CASCADE to WorkoutSessionRecord so deleting a session also deletes its record
-- Only update constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'WorkoutSessionRecord_sessionId_fkey'
    AND table_name = 'WorkoutSessionRecord'
  ) THEN
    ALTER TABLE "WorkoutSessionRecord" DROP CONSTRAINT "WorkoutSessionRecord_sessionId_fkey";
  END IF;
END
$$;

ALTER TABLE "WorkoutSessionRecord" ADD CONSTRAINT "WorkoutSessionRecord_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- WorkoutSessionExercise table (create only if it doesn't exist)
CREATE TABLE IF NOT EXISTS "WorkoutSessionExercise" (
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

-- Add foreign key constraint if table was just created or constraint doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'WorkoutSessionExercise_sessionId_fkey'
    AND table_name = 'WorkoutSessionExercise'
  ) THEN
    ALTER TABLE "WorkoutSessionExercise" ADD CONSTRAINT "WorkoutSessionExercise_sessionId_fkey"
      FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;

-- WorkoutSet table (create only if it doesn't exist)
CREATE TABLE IF NOT EXISTS "WorkoutSet" (
  "id"         TEXT NOT NULL,
  "exerciseId" TEXT NOT NULL,
  "reps"       INTEGER,
  "weight"     DOUBLE PRECISION,
  "completed"  BOOLEAN NOT NULL DEFAULT false,
  "order"      INTEGER NOT NULL,
  CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint if table was just created or constraint doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'WorkoutSet_exerciseId_fkey'
    AND table_name = 'WorkoutSet'
  ) THEN
    ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_exerciseId_fkey"
      FOREIGN KEY ("exerciseId") REFERENCES "WorkoutSessionExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END
$$;
