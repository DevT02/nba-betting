"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OddsTable from "./OddsTable";
import Header from "./Header";
import { FaTrophy } from "react-icons/fa";
import {
  AlertTriangleIcon,
  ClockIcon,
  MapPinIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useUserTimeZone } from "@/lib/timeZone";

export type OddsRow = {
  book: string;
  moneyline: string;
  probability: string;
  edge: string;
};

export type GameDetailsProps = {
  teamNames: string[];
  oddsData: {
    [teamName: string]: OddsRow[];
  };
  logos?: {
    [teamName: string]: string;
  };
  gameDetails: {
    h2h_record: string;
    over_under: string;
    player_injury: string;
    game_time: string;
    arena: string;
  };
};

function GameDetails({ teamNames, oddsData, logos, gameDetails }: GameDetailsProps) {
  const userTimeZone = useUserTimeZone();
  const getTeamLogo = (team: string) => `/logos/${team}.svg`;
  const eventTime = new Date(gameDetails.game_time);
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    timeZone: userTimeZone,
    timeZoneName: "short",
  }).format(eventTime);

  const bestTeam = React.useMemo(() => {
    return teamNames.reduce((prev, curr) => {
      const currProb = parseFloat(oddsData[curr][0]?.probability.replace("%", "")) || 0;
      const prevProb = parseFloat(oddsData[prev][0]?.probability.replace("%", "")) || 0;
      return currProb > prevProb ? curr : prev;
    }, teamNames[0]);
  }, [teamNames, oddsData]);

  const logoLeft = logos?.[teamNames[0]] ?? getTeamLogo(teamNames[0]);
  const logoRight = logos?.[teamNames[1]] ?? getTeamLogo(teamNames[1]);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
      }}
    >
      <Header />
      <main className="mx-auto px-4 sm:px-6 lg:px-8 mt-6 max-w-6xl">
        <div
          className="rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-6 sm:p-8 md:p-12 min-h-[550px] flex flex-col justify-between"
          style={{
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
          }}
        >
          {/* Header Section */}
          <h1 className="font-bold text-center -mb-2">
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              <img
                src={logoLeft}
                alt={`${teamNames[0]} logo`}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
              />
              <span className="whitespace-nowrap text-[0.75rem] sm:text-xs md:text-xl">
                {teamNames[0]} vs. {teamNames[1]}
              </span>
              <img
                src={logoRight}
                alt={`${teamNames[1]} logo`}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
              />
            </div>
          </h1>

          {/* Info Badges */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-[0.65rem] sm:text-xs text-gray-600 dark:text-gray-300 mt-2">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                <ClockIcon className="h-3 w-3" />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                <MapPinIcon className="h-3 w-3" />
                <span>{gameDetails.arena || "TBD"}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.65rem] sm:text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium text-purple-600">H2H:</span>
                <span>{gameDetails.h2h_record}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUpIcon className="h-3 w-3 text-green-600" />
                <span>{gameDetails.over_under}</span>
              </div>
              {gameDetails.player_injury && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertTriangleIcon className="h-3 w-3" />
                  <span>{gameDetails.player_injury}</span>
                </div>
              )}
            </div>
          </div>

          {/* Trophy Section */}
          <div className="flex font-inter items-center justify-center gap-2 text-[0.75rem] sm:text-xs md:text-lg text-gray-800 dark:text-gray-200 mb-4">
            <FaTrophy className="text-yellow-500 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="font-bold">{bestTeam}</span>
            <span className="text-[0.6rem] sm:text-xs md:text-base font-normal">
              ({oddsData[bestTeam][0]?.probability ?? "N/A"} probability)
            </span>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue={teamNames[0]}>
            <TabsList className="flex justify-center space-x-1 mb-4">
              {teamNames.map((team) => (
                <TabsTrigger key={team} value={team}>
                  {team}
                </TabsTrigger>
              ))}
            </TabsList>

            {teamNames.map((team) => (
              <TabsContent key={team} value={team}>
                <div className="overflow-x-auto">
                  <OddsTable oddsData={oddsData[team]} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Prediction Card */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-900 dark:to-blue-800 border border-blue-500 dark:border-blue-700 rounded-lg shadow-xl flex items-center justify-center">
          <p className="text-center text-[0.75rem] sm:text-base font-bold text-white">
            AI Prediction: <span className="underline">{bestTeam}</span> is most likely to win!
          </p>
        </div>
      </main>
    </div>
  );
}

export default GameDetails;
