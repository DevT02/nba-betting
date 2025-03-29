import { connectToDatabase } from './mongodb';

let evResultsCache: { data: any[]; timestamp: number } | null = null;
let upcomingGamesCache: any[] | null = null;
let gamesCache: any[] | null = null;

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
