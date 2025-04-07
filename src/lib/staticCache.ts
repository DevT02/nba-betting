import { connectToDatabase } from './mongodb';
import { deduplicateGames } from "@/lib/utils";
import { GamePreview } from "@/types/game";

let evResultsCache: { data: any[]; timestamp: number } | null = null;
let upcomingGamesCache: any[] | null = null;
let gamesCache: any[] | null = null;
let adjacentGamesCache: { gamePreviews: Record<string, GamePreview>; gameIds: string[] } | null = null;

// TTL for ev_results, 2 hours
const TTL = 2 * 60 * 60 * 1000;

/**
 * Returns the ev_results data from MongoDB, cached in memory.
 * Cache is invalidated after TTL.
 */
export async function getEvResults() {
  const now = Date.now();
  if (evResultsCache && now - evResultsCache.timestamp < TTL) {
    return evResultsCache.data;
  }
  const { db } = await connectToDatabase();
  const data = await db.collection("ev_results").find({}).toArray();
  evResultsCache = { data, timestamp: now };
  return data;
}

/**
 * Returns the upcoming_games data from MongoDB, cached permanently per instance.
 */
export async function getUpcomingGames() {
  if (upcomingGamesCache) {
    return upcomingGamesCache;
  }
  const { db } = await connectToDatabase();
  upcomingGamesCache = await db.collection("upcoming_games").find({}).toArray();
  return upcomingGamesCache;
}

/**
 * Returns the games data from MongoDB, cached in memory.
 */
export async function getGames() {
  if (gamesCache) {
    return gamesCache;
  }
  const { db } = await connectToDatabase();
  gamesCache = await db.collection("games").find({}).toArray();
  return gamesCache;
}

/**
 * Gets adjacent games from the ev_results collection, deduplicates them,
 * and returns a record of game previews and their IDs.
 * @returns { gamePreviews: Record<string, GamePreview>; gameIds: string[] } - A record of game previews and their IDs.
 * The game previews are deduplicated based on the game ID, and the IDs are returned as an array.
 */
export async function getAdjacentGames() {
  if (adjacentGamesCache) return adjacentGamesCache;
  
  const evResults = await getEvResults();
  const uniqueGameRecords = deduplicateGames(evResults);
  
  const gamePreviews: Record<string, GamePreview> = {};
  uniqueGameRecords.forEach((game) => {
    const id = game._id.toString();
    gamePreviews[id] = {
      _id: id,
      home_team: game.home_team,
      away_team: game.away_team,
      commence_time: game.commence_time,
    };
  });
  
  const gameIds = uniqueGameRecords.map((game) => game._id.toString());
  adjacentGamesCache = { gamePreviews, gameIds };
  return adjacentGamesCache;
}
