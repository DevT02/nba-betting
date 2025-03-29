import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deduplicateGames(games: any[]) {
  const seen = new Set();
  const uniqueGames: any[] = [];
  for (const game of games) {
    const timeKey = new Date(game.commence_time).toISOString();
    const key = `${game.home_team}-${game.away_team}-${timeKey}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueGames.push(game);
    }
  }
  return uniqueGames;
}
