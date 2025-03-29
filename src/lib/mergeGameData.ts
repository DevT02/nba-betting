/**
 * Merges arena (and potentially other details) from the upcoming_games collection
 * into a base game record from ev_results.
 * 
 * Finds games in upcoming_games with a game_time within 3 hours of commence_time.
 */
export async function mergeArenaInfo(baseGame: any, upcomingGames: any[]): Promise<any> {
  const { home_team, away_team, commence_time } = baseGame;

  const baseGameTime = new Date(commence_time);
  const timeWindowMs = 3 * 60 * 60 * 1000; // +-3 hours
  const windowStart = new Date(baseGameTime.getTime() - timeWindowMs);
  const windowEnd = new Date(baseGameTime.getTime() + timeWindowMs);

  const match = upcomingGames.find((g) => {
    const gameTime = new Date(g.game_time);
    return (gameTime >= windowStart && gameTime <= windowEnd && g.home_team.toLowerCase() === home_team.toLowerCase() &&
      g.away_team.toLowerCase() === away_team.toLowerCase()
    );
  });

  return { ...baseGame, arena: match?.arena ?? "Location not available" };
}
