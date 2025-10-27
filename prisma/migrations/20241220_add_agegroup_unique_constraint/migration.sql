-- Migration: Add ageGroupCode unique constraint to SquadAssignment
-- Created: 2024-12-20

-- Step 1: Add ageGroupCode column to squad_assignments table
ALTER TABLE "squad_assignments" ADD COLUMN "ageGroupCode" TEXT;

-- Step 2: Update existing records with ageGroupCode from squad table
UPDATE "squad_assignments" 
SET "ageGroupCode" = (
  SELECT "ageGroupCode" 
  FROM "squads" 
  WHERE "squads"."id" = "squad_assignments"."squadId"
);

-- Step 3: Make ageGroupCode NOT NULL after populating data
-- Note: This will fail if there are NULL values, so we ensure all records are updated first

-- Step 4: Add unique constraint
CREATE UNIQUE INDEX "squad_assignments_userId_ageGroupCode_key" ON "squad_assignments"("userId", "ageGroupCode");

-- Step 5: Add index for performance
CREATE INDEX "squad_assignments_ageGroupCode_idx" ON "squad_assignments"("ageGroupCode");
