"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import OddsTable from "./OddsTable";
import Header from "./Header";
import { FaTrophy } from "react-icons/fa";
import { ClockIcon, MapPinIcon, TrendingUpIcon, AlertTriangleIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserTimeZone } from "@/lib/timeZone";
import PreviewBanner from "./PreviewBanner";
import { useAdjacentGameNavigation } from "@/hooks/useAdjacentGameNavigation";
import { usePreviewMode } from "@/hooks/usePreviewMode";
import { GameDetailsProps } from "@/types/game";
import { motion } from "framer-motion";
import GameSelector from "./mobile/GameSelector";

function GameDetails({teamNames, oddsData, logos, gameDetails, gameIds, currentGameId, gamePreviews}: GameDetailsProps) {
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

  const bestTeam = React.useMemo(() => {
    return teamNames.reduce((prev, curr) => {
      const currProb = parseFloat(oddsData[curr][0]?.probability.replace("%", "")) || 0;
      const prevProb = parseFloat(oddsData[prev][0]?.probability.replace("%", "")) || 0;
      return currProb > prevProb ? curr : prev;
    }, teamNames[0]);
  }, [teamNames, oddsData]);

  const logoLeft = logos?.[teamNames[0]] ?? getTeamLogo(teamNames[0]);
  const logoRight = logos?.[teamNames[1]] ?? getTeamLogo(teamNames[1]);

  const { getAdjacentGameId } = useAdjacentGameNavigation(gameIds, currentGameId);
  const prevId = getAdjacentGameId("prev");
  const nextId = getAdjacentGameId("next");

  const currentIndex: number = gameIds && currentGameId ? gameIds.indexOf(currentGameId) : -1;
  
  // Extend slices to include up to 7 items.
  const prevPreviews = gameIds && currentIndex > 0
    ? gameIds
        .slice(Math.max(0, currentIndex - 7), currentIndex)
        .map(id => (gamePreviews ? gamePreviews[id] : undefined))
        .filter((preview): preview is any => Boolean(preview))
    : [];
  const nextPreviews = gameIds && currentIndex !== -1 && currentIndex < gameIds.length - 1
    ? gameIds
        .slice(currentIndex + 1, currentIndex + 8)
        .map(id => (gamePreviews ? gamePreviews[id] : undefined))
        .filter((preview): preview is any => Boolean(preview))
    : [];

  // Measure header height dynamically.
  const [headerHeight, setHeaderHeight] = useState(80);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const headerEl = document.querySelector("header");
      if (headerEl) {
        setHeaderHeight(headerEl.clientHeight);
      }
    }
  }, []);

  const { leftBannerMode, rightBannerMode } = usePreviewMode();

  // Scroll handling for H2H info.
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setShowLeftGradient(container.scrollLeft > 5);
    setShowRightGradient(
      container.scrollWidth > container.clientWidth &&
      container.scrollLeft < container.scrollWidth - container.clientWidth - 5
    );
  };
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleScroll);
    }
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Mobile detection and swipe functionality.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // For mobile swiping, store the window width in state.
  const [windowWidth, setWindowWidth] = useState(768);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => setWindowWidth(window.innerWidth);
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const [swipeDirection, setSwipeDirection] = useState<"swipeLeft" | "swipeRight" | null>(null);
  const cardVariants = {
    initial: { x: 0, opacity: 1, rotate: 0 },
    swipeLeft: { x: -windowWidth, opacity: 0, rotate: -20 },
    swipeRight: { x: windowWidth, opacity: 0, rotate: 20 },
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 100;
    if (info.offset.x < -threshold && nextId) {
      setSwipeDirection("swipeLeft");
      setTimeout(() => {
        router.push(`/gamedetails/${nextId}`);
      }, 300);
    } else if (info.offset.x > threshold && prevId) {
      setSwipeDirection("swipeRight");
      setTimeout(() => {
        router.push(`/gamedetails/${prevId}`);
      }, 300);
    } else {
      setSwipeDirection(null);
    }
  };

  return (
    <div style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }} className="min-h-screen">
      <Header />
      {isMobile && gameIds && gamePreviews && (
        <div className="px-4 sm:px-6 lg:px-8 mt-2">
          <GameSelector 
            games={gameIds.map(id => gamePreviews[id]).filter(Boolean)} 
            currentGameId={currentGameId}
          />
        </div>
      )}
      <main className="mx-auto px-4 sm:px-6 lg:px-8 mt-6 max-w-6xl">
        {isMobile ? (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            variants={cardVariants}
            initial="initial"
            animate={swipeDirection ? swipeDirection : "initial"}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-4 sm:p-6 md:p-8 min-h-[550px] flex flex-col justify-between"
            style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
          >
            <div className="flex flex-col items-center gap-4 mb-4">
              <h1 className="font-bold text-center">
                <div className="flex items-center justify-center gap-2 sm:gap-4 flex-nowrap">
                <img src={logoLeft} alt={`${teamNames[0]} logo`} className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="whitespace-nowrap text-base sm:text-md md:text-2xl lg:text-3xl overflow-hidden overflow-ellipsis">
                    {teamNames[0]} vs. {teamNames[1]}
                  </span>
                  <img src={logoRight} alt={`${teamNames[1]} logo`} className="w-8 h-8" />
                </div>
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-1">
                <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full">
                  <ClockIcon className="h-4 w-4 text-red-500" />
                  <span className="text-xs">{formattedTime}</span>
                </div>
                <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded-full">
                  <MapPinIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-xs">{gameDetails.arena || "TBD"}</span>
                </div>
              </div>
              <div className="py-1 w-full">
                <div className="border-t border-b border-gray-100 dark:border-gray-800/50 relative">
                  {showLeftGradient && (
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-zinc-900 to-transparent pointer-events-none z-10" />
                  )}
                  <div
                    ref={scrollContainerRef}
                    className="py-3 flex items-center justify-center gap-x-4 overflow-x-auto whitespace-nowrap px-4 text-xs scroll-pl-4"
                    onScroll={handleScroll}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-purple-500 dark:text-purple-400">H2H:</span>
                      <span className="text-xs">{gameDetails.h2h_record}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUpIcon className="h-4 w-4 text-green-500 dark:text-green-400" />
                      <span className="text-xs">{gameDetails.over_under}</span>
                    </div>
                    {gameDetails.player_injury && (
                      <div className="flex items-center gap-1">
                        <AlertTriangleIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
                        <span className="text-xs">{gameDetails.player_injury}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 border border-yellow-200 dark:border-yellow-900/50 px-4 py-2 rounded-lg">
                <FaTrophy className="text-yellow-500 dark:text-yellow-400 h-4 w-4" />
                <span className="font-bold text-xs">{bestTeam}</span>
                <span className="text-xs">({oddsData[bestTeam][0]?.probability ?? "N/A"} probability)</span>
              </div>
              <Tabs defaultValue={teamNames[0]}>
                <TabsList className="mx-auto mb-3 bg-card/80 border border-border/30 shadow-sm rounded-lg
                  w-fit
                  flex
                  gap-1
                ">
                  {teamNames.map((team) => (
                    <TabsTrigger
                      key={team}
                      value={team}
                      className="relative min-w-[100px] px-3 py-1.5 text-sm font-medium transition-all duration-200
                                data-[state=active]:bg-transparent 
                                data-[state=active]:text-foreground
                                data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground/80"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="relative w-4 h-4 flex items-center justify-center rounded overflow-hidden">
                          <img
                            src={logos?.[team] ?? getTeamLogo(team)}
                            alt={`${team} logo`}
                            className="w-3.5 h-3.5 object-contain"
                          />
                        </div>
                        <span>{team}</span>
                      </div>
                      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary
                                      scale-x-0 transition-transform duration-200
                                      data-[state=active]:scale-x-100" />
                    </TabsTrigger>
                  ))}
                </TabsList>
                {teamNames.map((team) => (
                  <TabsContent
                    key={team}
                    value={team}
                    className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                  >
                    <OddsTable oddsData={oddsData[team]} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </motion.div>
        ) : (
          <div
            className="rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-800 p-6 sm:p-8 md:p-12 min-h-[550px] flex flex-col justify-between"
            style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--card-foreground))" }}
          >
            <div className="flex flex-col items-center gap-6 mb-8">
              <h1 className="font-bold text-center">
                <div className="flex items-center justify-center gap-2 sm:gap-4 flex-nowrap">
                  <img src={logoLeft} alt={`${teamNames[0]} logo`} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                  <span className="whitespace-nowrap text-[0.75rem] text-xl sm:text-2xl md:text-3xl lg:text-4xl overflow-hidden overflow-ellipsis">
                    {teamNames[0]} vs. {teamNames[1]}
                  </span>
                  <img src={logoRight} alt={`${teamNames[1]} logo`} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
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
                    <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white dark:from-zinc-900 to-transparent pointer-events-none z-10" />
                  )}
                  <div ref={scrollContainerRef} className="py-3 flex items-center justify-center gap-x-6 sm:gap-x-8 overflow-x-auto whitespace-nowrap px-4 text-xs sm:text-sm scroll-pl-4" onScroll={handleScroll}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-purple-500 dark:text-purple-400">H2H:</span>
                      <span className="text-xs">{gameDetails.h2h_record}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="h-4 w-4 text-green-500 dark:text-green-400" />
                      <span className="text-xs">{gameDetails.over_under}</span>
                    </div>
                    {gameDetails.player_injury && (
                      <div className="flex items-center gap-2">
                        <AlertTriangleIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
                        <span className="text-xs">{gameDetails.player_injury}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 border border-yellow-200 dark:border-yellow-900/50 px-4 py-2 rounded-lg">
                <FaTrophy className="text-yellow-500 dark:text-yellow-400 h-4 w-4" />
                <span className="font-bold text-xs">{bestTeam}</span>
                <span className="text-xs">({oddsData[bestTeam][0]?.probability ?? "N/A"} probability)</span>
              </div>
            </div>
            <Tabs defaultValue={teamNames[0]}>
              <TabsList className="mx-auto mb-3 bg-card/80 border border-border/30 shadow-sm rounded-lg
                w-fit
                flex
                gap-1
              ">
                {teamNames.map((team) => (
                  <TabsTrigger
                    key={team}
                    value={team}
                    className="relative min-w-[100px] px-3 py-1.5 text-sm font-medium transition-all duration-200
                              data-[state=active]:bg-transparent 
                              data-[state=active]:text-foreground
                              data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground/80"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-4 h-4 flex items-center justify-center rounded overflow-hidden">
                        <img
                          src={logos?.[team] ?? getTeamLogo(team)}
                          alt={`${team} logo`}
                          className="w-3.5 h-3.5 object-contain"
                        />
                      </div>
                      <span>{team}</span>
                    </div>
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary
                                    scale-x-0 transition-transform duration-200
                                    data-[state=active]:scale-x-100" />
                  </TabsTrigger>
                ))}
              </TabsList>
              {teamNames.map((team) => (
                <TabsContent
                  key={team}
                  value={team}
                  className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                >
                  <OddsTable oddsData={oddsData[team]} />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
        <div className="flex justify-between my-6">
          <button
            onClick={() => { if (prevId) router.push(`/gamedetails/${prevId}`); }}
            disabled={!prevId}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors ${
              prevId 
                ? "bg-card hover:bg-accent text-card-foreground border border-border" 
                : "bg-muted text-muted-foreground cursor-not-allowed border border-border opacity-50"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="font-medium">Previous</span>
          </button>
          
          <button
            onClick={() => { if (nextId) router.push(`/gamedetails/${nextId}`); }}
            disabled={!nextId}
            className={`px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors ${
              nextId 
                ? "bg-card hover:bg-accent text-card-foreground border border-border" 
                : "bg-muted text-muted-foreground cursor-not-allowed border border-border opacity-50"
            }`}
          >
            <span className="font-medium">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Only render preview banners on non-mobile */}
        {!isMobile && (
          <>
            <PreviewBanner direction="left" previews={prevPreviews} mode={leftBannerMode} headerHeight={headerHeight} />
            <PreviewBanner direction="right" previews={nextPreviews} mode={rightBannerMode} headerHeight={headerHeight} />
          </>
        )}
        <div className="mt-8 p-4 bg-card border border-border rounded-lg shadow-sm flex items-center justify-center">
          <p className="text-center text-[0.75rem] sm:text-base font-medium text-card-foreground">
            <span className="font-bold">AI Prediction:</span>{" "}
            <span className="underline text-primary">{bestTeam}</span> is most likely to win!
          </p>
        </div>
      </main>
    </div>
  );
}

export default GameDetails;
