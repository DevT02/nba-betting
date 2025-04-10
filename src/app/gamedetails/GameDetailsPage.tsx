import React from "react";
import { ObjectId } from "mongodb";
import GameDetails from "@/components/game/GameDetails";
import { GameDetailsPageProps } from "@/types/gameDetails";

import { mergeArenaInfo } from "@/lib/mergeGameData";
import { getUpcomingGames, getEvResults, getAdjacentGames } from "@/lib/staticCache";
import { connectToDatabase } from "@/lib/mongodb";
import { getTeamLogo } from "@/lib/teamNameMap";
import { deduplicateGames } from "@/lib/utils"; 

import { GamePreview } from "@/types/game";

function formatMoneyline(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num > 0 ? `+${num}` : `${num}`;
}

export default async function GameDetailsPage({ id }: GameDetailsPageProps) {
  if (!id) {
    return <p className="text-center text-gray-600">No game ID provided.</p>;
  }
  const { db } = await connectToDatabase();

  const baseGameRecord = await db.collection("ev_results").findOne({ _id: new ObjectId(id) });
  if (!baseGameRecord) {
    return <p className="text-center text-gray-600">No game data available.</p>;
  }

  const upcomingGames = await getUpcomingGames();
  const mergedGameRecord = await mergeArenaInfo(baseGameRecord, upcomingGames);
  mergedGameRecord._id = mergedGameRecord._id.toString(); // plain object ID for JSON serialization

  const { home_team, away_team, commence_time } = mergedGameRecord;
  const gameRecords = await db.collection("ev_results")
    .find({ home_team, away_team, commence_time })
    .toArray();

  // Use cached adjacent games for previous/next navigation.
  const { gamePreviews, gameIds } = await getAdjacentGames();

  const bookmakers = gameRecords.map((record) => ({
    book: record.bookmaker,
    home_moneyline: formatMoneyline(record.home_odds),
    home_probability: `${(record.home_win_prob * 100).toFixed(2)}%`,
    home_edge: record.home_ev.toString(),
    home_kelly: record.home_kelly !== undefined ? record.home_kelly.toString() : undefined,
    away_moneyline: formatMoneyline(record.away_odds),
    away_probability: `${(record.away_win_prob * 100).toFixed(2)}%`,
    away_edge: record.away_ev.toString(),
    away_kelly: record.away_kelly !== undefined ? record.away_kelly.toString() : undefined,
  }));

  const oddsData = {
    [home_team]: bookmakers.map((b) => ({
      book: b.book,
      moneyline: b.home_moneyline,
      probability: b.home_probability,
      edge: b.home_edge,
      kelly: b.home_kelly,
    })),
    [away_team]: bookmakers.map((b) => ({
      book: b.book,
      moneyline: b.away_moneyline,
      probability: b.away_probability,
      edge: b.away_edge,
      kelly: b.away_kelly,
    })),
  };

  const eventTime = new Date(commence_time);
  const gameDetails = {
    game_time: eventTime.toISOString(),
    arena: mergedGameRecord.arena,
    h2h_record: "H2H data not available",
    over_under: "Over/Under data not available",
    player_injury: "No injury updates",
  };

  const teamLogos = {
    [home_team]: getTeamLogo(home_team),
    [away_team]: getTeamLogo(away_team),
  };

  const teamNames = [home_team, away_team];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <GameDetails
        teamNames={teamNames}
        oddsData={oddsData}
        logos={teamLogos}
        gameDetails={gameDetails}
        gameIds={gameIds}              
        currentGameId={mergedGameRecord._id}
        gamePreviews={gamePreviews}
      />
    </div>
  );
}
