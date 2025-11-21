-- Migration: Add Match System Tables
-- Created: 2024-12-21
-- Description: Creates Match, MatchPlayer, and MatchPlayerStats tables

-- Create matches table
CREATE TABLE IF NOT EXISTS "matches" (
    "id" TEXT NOT NULL,
    "squadId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "opponent" TEXT,
    "score" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "ballPossession" DOUBLE PRECISION,
    "totalShots" INTEGER NOT NULL DEFAULT 0,
    "shotsOnTarget" INTEGER NOT NULL DEFAULT 0,
    "shotsOffTarget" INTEGER NOT NULL DEFAULT 0,
    "blockedShots" INTEGER NOT NULL DEFAULT 0,
    "shotsOffPost" INTEGER NOT NULL DEFAULT 0,
    "missedChances" INTEGER NOT NULL DEFAULT 0,
    "opponentBoxTouches" INTEGER NOT NULL DEFAULT 0,
    "corners" INTEGER NOT NULL DEFAULT 0,
    "fouls" INTEGER NOT NULL DEFAULT 0,
    "totalPasses" INTEGER NOT NULL DEFAULT 0,
    "accuratePasses" INTEGER NOT NULL DEFAULT 0,
    "duelsWon" INTEGER NOT NULL DEFAULT 0,
    "ballRecoveries" INTEGER NOT NULL DEFAULT 0,
    "aerialDuelsWon" INTEGER NOT NULL DEFAULT 0,
    "interceptions" INTEGER NOT NULL DEFAULT 0,
    "clearances" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- Create match_players table
CREATE TABLE IF NOT EXISTS "match_players" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "position" TEXT,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_players_pkey" PRIMARY KEY ("id")
);

-- Create match_player_stats table
CREATE TABLE IF NOT EXISTS "match_player_stats" (
    "id" TEXT NOT NULL,
    "matchPlayerId" TEXT NOT NULL,
    "passes" INTEGER NOT NULL DEFAULT 0,
    "keyPasses" INTEGER NOT NULL DEFAULT 0,
    "shots" INTEGER NOT NULL DEFAULT 0,
    "blockedShots" INTEGER NOT NULL DEFAULT 0,
    "groundDuels" INTEGER NOT NULL DEFAULT 0,
    "aerialDuels" INTEGER NOT NULL DEFAULT 0,
    "ballRecoveries" INTEGER NOT NULL DEFAULT 0,
    "looseBallRecoveries" INTEGER NOT NULL DEFAULT 0,
    "interceptions" INTEGER NOT NULL DEFAULT 0,
    "dribbles" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "foulsCommitted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "match_player_stats_pkey" PRIMARY KEY ("id")
);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS "match_players_matchId_userId_key" ON "match_players"("matchId", "userId");
CREATE UNIQUE INDEX IF NOT EXISTS "match_player_stats_matchPlayerId_key" ON "match_player_stats"("matchPlayerId");

-- Create foreign key constraints
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'matches_squadId_fkey'
    ) THEN
        ALTER TABLE "matches" ADD CONSTRAINT "matches_squadId_fkey" 
        FOREIGN KEY ("squadId") REFERENCES "squads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'match_players_matchId_fkey'
    ) THEN
        ALTER TABLE "match_players" ADD CONSTRAINT "match_players_matchId_fkey" 
        FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'match_players_userId_fkey'
    ) THEN
        ALTER TABLE "match_players" ADD CONSTRAINT "match_players_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'match_player_stats_matchPlayerId_fkey'
    ) THEN
        ALTER TABLE "match_player_stats" ADD CONSTRAINT "match_player_stats_matchPlayerId_fkey" 
        FOREIGN KEY ("matchPlayerId") REFERENCES "match_players"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "matches_squadId_idx" ON "matches"("squadId");
CREATE INDEX IF NOT EXISTS "matches_date_idx" ON "matches"("date");
CREATE INDEX IF NOT EXISTS "match_players_matchId_idx" ON "match_players"("matchId");
CREATE INDEX IF NOT EXISTS "match_players_userId_idx" ON "match_players"("userId");

