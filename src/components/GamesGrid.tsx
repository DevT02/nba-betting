"use client";

import React from "react";
import Link from "next/link";
import { Clock, MapPin, Calendar } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { getTeamLogo } from "@/lib/teamNameMap";
import { useUserTimeZone } from "@/lib/timeZone";

type GamesGridProps = {
  games: any[];
  activeTab: string;
};

export default function GamesGrid({ games, activeTab }: GamesGridProps) {
  const userTimeZone = useUserTimeZone();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {games.length > 0 ? (
        games.map((game) => {
          const gameTime = new Date(game.commence_time);
          const { home_team, away_team } = game;
          const gameId = game._id.toString();

          return (
            <Link key={gameId} href={`/gamedetails/${gameId}`}>
              <div
                className="w-full rounded-lg p-4 sm:p-5 shadow-sm cursor-pointer border border-gray-200 dark:border-zinc-800 flex flex-col"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-5 w-5" />
                  <span className="font-semibold text-sm sm:text-base">
                    {gameTime.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 flex-shrink-0">
                    <img
                      src={getTeamLogo(home_team)}
                      alt={`${home_team} logo`}
                      className="object-contain w-full h-full p-1"
                    />
                  </div>
                  <span className="font-semibold text-lg">{home_team}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-16 h-16 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 flex-shrink-0">
                    <img
                      src={getTeamLogo(away_team)}
                      alt={`${away_team} logo`}
                      className="object-contain w-full h-full p-1"
                    />
                  </div>
                  <span className="font-semibold text-lg">{away_team}</span>
                </div>
                <div className="mt-5 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <MapPin className="h-5 w-5" />
                    <span className="font-medium">{game.arena || "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                    <Clock className="h-5 w-5" />
                    <span>
                      {formatInTimeZone(gameTime, userTimeZone, "h:mm a zzz")}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <p className="text-center col-span-full">
          No games available for {activeTab}.
        </p>
      )}
    </div>
  );
}
