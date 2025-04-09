import { getGames } from "@/lib/staticCache";

export default async function GameResults() {
  const results = await getGames();
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <h2 className="text-xl font-bold mb-4">Game Results</h2>
      <ul className="space-y-3">
        {results.map((game) => (
          <li
            key={game._id.toString()}
            className="p-4 shadow rounded"
            style={{
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
            }}
          >
            <p className="text-lg font-semibold">
              {game.away_team} vs. {game.home_team}
            </p>
            <p className="text-sm">
              {new Date(game.commence_time).toLocaleString()}
            </p>
            <p className="text-sm">
              <span className="text-red-600">Away Win Probability:</span>{" "}
              {game.away_win_prob.toFixed(2)}
            </p>
            <p className="text-sm">
              <span className="text-green-600">Home Win Probability:</span>{" "}
              {game.home_win_prob.toFixed(2)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
