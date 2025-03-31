"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
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
import { AdjacentGamePreview } from "@/components/game/AdjacentGamePreview";
import { motion } from "framer-motion";

export type GamePreview = {
  _id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
};

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
  gameIds?: string[];
  currentGameId?: string;
  gamePreviews?: Record<string, GamePreview>;
};

function GameDetails({ teamNames, oddsData, logos, gameDetails, gameIds, currentGameId, gamePreviews }: GameDetailsProps) {
  const router = useRouter();
  const userTimeZone = useUserTimeZone();
  const getTeamLogo = (team: string) => `/logos/${team}.svg`;
  const eventTime = new Date(gameDetails.game_time);
  const formattedTime = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    timeZone: userTimeZone,
    timeZoneName: "short",
  }).format(eventTime);

  // Determine the best team based on the highest probability from the odds data
  const bestTeam = React.useMemo(() => {
    return teamNames.reduce((prev, curr) => {
      const currProb = parseFloat(oddsData[curr][0]?.probability.replace("%", "")) || 0;
      const prevProb = parseFloat(oddsData[prev][0]?.probability.replace("%", "")) || 0;
      return currProb > prevProb ? curr : prev;
    }, teamNames[0]);
  }, [teamNames, oddsData]);

  // logos for the teams 
  const logoLeft = logos?.[teamNames[0]] ?? getTeamLogo(teamNames[0]);
  const logoRight = logos?.[teamNames[1]] ?? getTeamLogo(teamNames[1]);

  // cool navigation helpers if gameids and currgameid are provided
  const getAdjacentGameId = (direction: "prev" | "next") => {
    if (!gameIds || !currentGameId) return null;
    const index = gameIds.indexOf(currentGameId);
    if (index === -1) return null;
    const newIndex = direction === "prev" ? index - 1 : index + 1;
    return gameIds[newIndex] || null;
  };

  React.useEffect(() => {
    if (!gameIds || !currentGameId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        const prevId = getAdjacentGameId("prev");
        if (prevId) {
          router.push(`/gamedetails/${prevId}`);
        }
      } else if (e.key === "ArrowRight") {
        const nextId = getAdjacentGameId("next");
        if (nextId) {
          router.push(`/gamedetails/${nextId}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameIds, currentGameId, router]);

  // get adjacent game IDs for preview buttons
  const prevId = getAdjacentGameId("prev");
  const nextId = getAdjacentGameId("next");

  // Look up preview data from the mapping if available
  const [showLeftPreview, setShowLeftPreview] = React.useState(false);
  const [showRightPreview, setShowRightPreview] = React.useState(false);
  const prevPreview = prevId && gamePreviews ? gamePreviews[prevId] : null;
  const nextPreview = nextId && gamePreviews ? gamePreviews[nextId] : null;
  const currentIndex: number = gameIds && currentGameId ? gameIds.indexOf(currentGameId) : -1;
  const prevPreviews: GamePreview[] =
    gameIds && currentIndex > 0
      ? gameIds
          .slice(Math.max(0, currentIndex - 3), currentIndex)
          .map((id) => gamePreviews ? gamePreviews[id] : undefined)
          .filter((preview): preview is GamePreview => Boolean(preview))
      : [];

  const nextPreviews: GamePreview[] =
    gameIds && currentIndex !== -1 && currentIndex < gameIds.length - 1
      ? gameIds
          .slice(currentIndex + 1, currentIndex + 4)
          .map((id) => gamePreviews ? gamePreviews[id] : undefined)
          .filter((preview): preview is GamePreview => Boolean(preview))
      : [];
  
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 100) {
        setShowLeftPreview(true);
        setShowRightPreview(false);
      } else if (e.clientX > window.innerWidth - 100) {
        setShowRightPreview(true);
        setShowLeftPreview(false);
      } else {
        setShowLeftPreview(false);
        setShowRightPreview(false);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  
  /* scroll stuff for h2h, etc content */
  const [showLeftGradient, setShowLeftGradient] = React.useState(false);
  const [showRightGradient, setShowRightGradient] = React.useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    setShowLeftGradient(scrollContainer.scrollLeft > 5);
    setShowRightGradient(
      scrollContainer.scrollWidth > scrollContainer.clientWidth &&
      scrollContainer.scrollLeft < (scrollContainer.scrollWidth - scrollContainer.clientWidth - 5)
    );
  };

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      handleScroll();
      scrollContainer.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

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
          <div className="flex flex-col items-center gap-6 mb-8">
            <h1 className="font-bold text-center">
              <div className="flex items-center justify-center gap-2 sm:gap-4 flex-nowrap">
                <img
                  src={logoLeft}
                  alt={`${teamNames[0]} logo`}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
                />
                <span className="whitespace-nowrap text-[0.75rem] text-xl sm:text-2xl md:text-3xl lg:text-4xl overflow-hidden overflow-ellipsis">
                  {teamNames[0]} vs. {teamNames[1]}
                </span>
                <img
                  src={logoRight}
                  alt={`${teamNames[1]} logo`}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
                />
              </div>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full">
                <ClockIcon className="h-4 w-4 text-red-500" />
                <span className="font-medium">{formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-full">
                <MapPinIcon className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{gameDetails.arena || "TBD"}</span>
              </div>
            </div>

            <div className="py-1 w-full">
              <div className="border-t border-b border-gray-100 dark:border-gray-800/50 relative">
                {showLeftGradient && (
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-zinc-900 to-transparent pointer-events-none z-10"></div>
                )}
                
                <div 
                  ref={scrollContainerRef}
                  className="py-3 flex items-center justify-start md:justify-center gap-x-6 sm:gap-x-8 overflow-x-auto whitespace-nowrap px-4 text-xs sm:text-sm scroll-pl-4"
                  onScroll={handleScroll}
                >
                  <div className="flex items-center gap-2 flex-shrink-0 pl-2">
                    <span className="font-medium text-purple-500 dark:text-purple-400">H2H:</span>
                    <span>{gameDetails.h2h_record}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <TrendingUpIcon className="h-4 w-4 text-green-500 dark:text-green-400" />
                    <span>{gameDetails.over_under}</span>
                  </div>
                  {gameDetails.player_injury && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <AlertTriangleIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
                      <span>{gameDetails.player_injury}</span>
                    </div>
                  )}
                </div>
                {showRightGradient && (
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white dark:from-zinc-900 to-transparent pointer-events-none z-10"></div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg border border-yellow-200 dark:border-yellow-900/50 px-4 py-2 rounded-lg">
              <FaTrophy className="text-yellow-500 dark:text-yellow-400 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-bold">{bestTeam}</span>
              <span className="text-xs sm:text-sm md:text-base font-normal">
                ({oddsData[bestTeam][0]?.probability ?? "N/A"} probability)
              </span>
            </div>
          </div>

          <Tabs defaultValue={teamNames[0]}>
            <TabsList className="flex justify-center space-x-3 mb-4">
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

        {(prevPreviews.length > 0 || nextPreviews.length > 0) && (
          <>
            {prevPreviews.length > 0 && showLeftPreview && (
              <motion.div
                initial={{ opacity: 0, x: -150 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -150 }}
                transition={{ duration: 0.3 }}
                className="fixed left-0 top-0 bottom-0 w-1/4 bg-gray-100 dark:bg-gray-700 p-4 shadow-xl z-50 cursor-pointer"
                onClick={() =>
                  router.push(`/gamedetails/${prevPreviews[0]._id}`)
                }
              >
                <div className="flex flex-col space-y-4">
                  {prevPreviews.map((preview) => (
                    <motion.div
                      key={preview._id}
                      whileHover={{ scale: 1.05 }}
                      className="transition-transform"
                      onClick={() => router.push(`/gamedetails/${preview._id}`)}
                    >
                      <AdjacentGamePreview game={preview} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {nextPreviews.length > 0 && showRightPreview && (
              <motion.div
                initial={{ opacity: 0, x: 150 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 150 }}
                transition={{ duration: 0.3 }}
                className="fixed right-0 top-0 bottom-0 w-1/4 bg-gray-100 dark:bg-gray-700 p-4 shadow-xl z-50 cursor-pointer"
                onClick={() =>
                  router.push(`/gamedetails/${nextPreviews[0]._id}`)
                }
              >
                <div className="flex flex-col space-y-4">
                  {nextPreviews.map((preview) => (
                    <motion.div
                      key={preview._id}
                      whileHover={{ scale: 1.05 }}
                      className="transition-transform"
                      onClick={() => router.push(`/gamedetails/${preview._id}`)}
                    >
                      <AdjacentGamePreview game={preview} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

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
