import Header from "@/components/game/Header";
import Link from "next/link";
import InfoBanner from "@/components/game/InfoBanner"; 

import { formatInTimeZone } from "date-fns-tz";
import { addDays } from "date-fns";

import { mergeArenaInfo } from "@/lib/mergeGameData"; 
import { getEvResults, getUpcomingGames } from "@/lib/staticCache";
import { getTeamLogo } from "@/lib/teamNameMap";
import { deduplicateGames } from "@/lib/utils";

import GamesGridWrapper from "@/components/game/GamesGridWrapper";
import TimeZoneSync from '@/components/utils/TimeZoneSync';
import { InfoTooltip, TooltipProvider } from "@/components/utils/ToolTipComponent";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const { tab, tz } = sp;

  // Set active tab and time zone
  const activeTab = Array.isArray(tab) ? tab[0] || "Featured" : tab || "Featured";
  const timeZone = Array.isArray(tz) ? tz[0] : tz || "America/New_York";

  // Get today's and tomorrow's boundaries based on the time zone
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


  // Filter games based on the selected tab
  if (activeTab === "Featured") {
    // For featured, group today’s games and choose the ones with the best Kelly criterion (bankroll percentage)
    const groupedGames = new Map();
    for (const game of evResults) {
      const gameTime = new Date(game.commence_time);
      if (gameTime >= new Date(startTodayStr) && gameTime <= new Date(endTodayStr)) {
        const key = `${game.home_team}-${game.away_team}-${game.commence_time}`;
        const existing = groupedGames.get(key);
        const maxKelly = Math.max(game.home_kelly, game.away_kelly);
        if (!existing || maxKelly > Math.max(existing.home_kelly, existing.away_kelly)) {
          groupedGames.set(key, game);
        }
      }
    }
    // Convert grouped values to an array, sort descending by highest Kelly percentage, and limit to the top 4.
    games = Array.from(groupedGames.values())
      .sort((a, b) => {
        const maxA = Math.max(a.home_kelly, a.away_kelly);
        const maxB = Math.max(b.home_kelly, b.away_kelly);
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
    games = evResults.filter((game) => {
      const gameTime = new Date(game.commence_time);
      return gameTime >= now && gameTime <= sevenDaysLater;
    });
  }

  games = deduplicateGames(games);
  games = await Promise.all(
    games.map(async (game) => {
      return await mergeArenaInfo(game, upcomingGames);
    })
  );
  games = JSON.parse(JSON.stringify(games)); // for JSON serialization
  let headingText = "";
  let subHeading = "";
  switch (activeTab) {
    case "Featured":
      headingText = "Featured Games";
      subHeading = "Today's top 4 betting picks, ranked by smart value (Kelly %)."
      break;
    case "Today":
      headingText = "Games Today";
      subHeading = "All the games happening today.";
      break;
    case "Tomorrow":
      headingText = "Games Tomorrow";
      subHeading = "Catch tomorrow's games and get ready to bet early!";
      break;
    case "Upcoming":
      headingText = "Upcoming Games (Next 7 Days)";
      subHeading = "All upcoming games from today until 7 days ahead.";
      break;
  }

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
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-4 xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto">
        {/* tab nav left-aligned */}
        <div className="pt-5 flex flex-col gap-2">
          <div className="flex items-center gap-6">
            {["Featured", "Today", "Tomorrow", "Upcoming"].map((tabName) => (
              <Link
                key={tabName}
                href={`/?tab=${tabName}`}
                className={`font-medium pb-1 border-b-2 transition-all duration-200 ${
                  activeTab === tabName
                    ? "border-red-500 dark:border-red-300 text-gray-900 dark:text-gray-100"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {tabName}
              </Link>
            ))}
          </div>
          <div className="w-full h-px bg-border dark:bg-zinc-800"></div>
        </div>

        {/* heading as to what it is */}
        <div className="mt-4 text-left flex items-center gap-1.5">
          <h2 className="text-2xl font-bold">{headingText}</h2>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-0.5">
          <p>{subHeading}</p>
          {activeTab === "Featured" && (
            <div className="flex items-center gap-1.5">
              <TooltipProvider>
                <InfoTooltip
                  text={
                    <div className="space-y-2">
                      <p>
                        Kelly percentage shows the recommended amount to bet based on expected value.
                      </p>
                      <p>
                        Higher values mean stronger bets; low or zero means avoid.
                      </p>
                      <p>
                        It's a long-term strategy used by smart bettors.
                      </p>
                    </div>
                  }
                  isMobile={false}
                />
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* grid layout - lg up screens dont have enough content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <GamesGridWrapper games={games} activeTab={activeTab} />
          </div>
          <aside className="hidden lg:block lg:col-span-4">
            <InfoBanner headerHeight={80} />
          </aside>
        </div>
      </div>
    </div>
  );
}
