import Header from "../components/Header";
import Link from "next/link";

import { Clock, MapPin, Calendar } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { addDays } from "date-fns";

import { mergeArenaInfo } from "@/lib/mergeGameData"; 
import { getEvResults, getUpcomingGames } from "@/lib/staticCache";
import { getTeamLogo } from "@/lib/teamNameMap";

import GamesGrid from "@/components/GamesGrid";
import TimeZoneSync from '@/components/utils/TimeZoneSync';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  function deduplicateGames(games: any[]) {
    const seen = new Set();
    const uniqueGames: any[] = [];
  
    for (const game of games) {
      const key = `${game.home_team}-${game.away_team}-${game.commence_time}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueGames.push(game);
      }
    }
    return uniqueGames;
  }
  
  const sp = await searchParams;
  const { tab, tz } = sp;

  const activeTab = Array.isArray(tab) ? tab[0] || "Featured" : tab || "Featured";
  const timeZone = Array.isArray(tz) ? tz[0] : tz || "America/New_York";
  const now = new Date();
  const startTodayStr = formatInTimeZone(now, timeZone, "yyyy-MM-dd'T'00:00:00XXX");
  const endTodayStr = formatInTimeZone(now, timeZone, "yyyy-MM-dd'T'23:59:59XXX");
  const tomorrow = addDays(now, 1);
  const startTomorrowStr = formatInTimeZone(tomorrow, timeZone, "yyyy-MM-dd'T'00:00:00XXX");
  const endTomorrowStr = formatInTimeZone(tomorrow, timeZone, "yyyy-MM-dd'T'23:59:59XXX");
  const sevenDaysLater = addDays(now, 7);
  const upcomingGames = await getUpcomingGames();

  const evResults = await getEvResults();
  let games: any[] = [];

  if (activeTab === "Featured") {
    const groupedGames = new Map<string, any>();
    for (const game of evResults) {
      const gameTime = new Date(game.commence_time);
      if (gameTime >= new Date(startTodayStr) && gameTime <= new Date(endTodayStr)) {
        const key = `${game.home_team}-${game.away_team}-${game.commence_time}`;
        const existing = groupedGames.get(key);
        const maxProb = Math.max(game.home_win_prob, game.away_win_prob);
  
        if (!existing || maxProb > Math.max(existing.home_win_prob, existing.away_win_prob)) {
          groupedGames.set(key, game);
        }
      }
    }
    games = Array.from(groupedGames.values())
      .sort((a, b) => {
        const maxA = Math.max(a.home_win_prob, a.away_win_prob);
        const maxB = Math.max(b.home_win_prob, b.away_win_prob);
        return maxB - maxA;
      })
      .slice(0, 4);
  } else if (activeTab === "Today") {
    games = evResults.filter((game) => {
      const gameTime = new Date(game.commence_time);
      return gameTime >= new Date(startTodayStr) && gameTime <= new Date(endTodayStr);
    });
  } else if (activeTab === "Tomorrow") {
    games = evResults.filter((game) => {
      const gameTime = new Date(game.commence_time);
      return gameTime >= new Date(startTomorrowStr) && gameTime <= new Date(endTomorrowStr);
    });
  } else if (activeTab === "Upcoming") {
    // For upcoming, filter games from now until seven days later.
    games = evResults.filter((game) => {
      const gameTime = new Date(game.commence_time);
      // gameTime > new Date(endTodayStr) && gameTime <= sevenDaysLater  if we want to include only games after today
      // but for now to include all games within the next 7 days from now, we can use the following condition:
      return gameTime >= now && gameTime <= sevenDaysLater;
    });
  }

  games = deduplicateGames(games);
  games = await Promise.all(
    games.map(async (game) => {
      return await mergeArenaInfo(game, upcomingGames);
    })
  );
  games = JSON.parse(JSON.stringify(games)); // for json serialization

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <TimeZoneSync />
      <Header />
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 flex flex-col gap-4">
        <div className="pt-4 flex items-center gap-6">
          {["Featured", "Today", "Tomorrow", "Upcoming"].map((tabName) => (
            <Link
              key={tabName}
              href={`/?tab=${tabName}`}
              className={`font-medium pb-1 border-b-2 ${
                activeTab === tabName
                  ? "border-red-500 dark:border-red-300"
                  : "border-transparent text-gray-500 dark:text-gray-400"
              }`}
            >
              {tabName}
            </Link>
          ))}
        </div>

        <GamesGrid games={games} activeTab={activeTab} />
      </div>
    </div>
  );
}
