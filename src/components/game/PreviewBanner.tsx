"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getTeamLogo } from "@/lib/teamNameMap";
import { GamePreview } from "@/types/game";
import { X, PanelLeftOpen, PanelRightOpen, Clock, Calendar } from "lucide-react";

type PreviewBannerProps = {
  direction: "left" | "right";
  todayPreviews: GamePreview[];
  upcomingPreviews: GamePreview[];
  mode: "hidden" | "peek" | "open";
  headerHeight?: number;
};

const PreviewBanner: React.FC<PreviewBannerProps> = ({
  direction,
  todayPreviews,
  upcomingPreviews,
  mode,
  headerHeight = 80
}) => {
  const router = useRouter();
  const [manuallyClosed, setManuallyClosed] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [bannerClicked, setBannerClicked] = useState(false);
  // Expanded states for each section
  const [todayExpanded, setTodayExpanded] = useState(false);
  const [upcomingExpanded, setUpcomingExpanded] = useState(false);
  const PREVIEW_LIMIT = 3;

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeaderVisible = scrollPosition < headerHeight;
  const topPosition = isHeaderVisible ? headerHeight : 0;
  const buttonVerticalPosition = "50%";

  if (manuallyClosed) {
    return (
      <motion.div
        className={`fixed ${direction}-0 z-40`}
        style={{
          top: buttonVerticalPosition,
          transform: "translateY(-50%)",
        }}
        initial={{ opacity: 0, x: direction === "left" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.button
          onClick={() => {
            setManuallyClosed(false);
            setManuallyOpened(true);
          }}
          className={`p-3 bg-card border border-border rounded-lg hover:bg-muted shadow-sm transition-all flex items-center gap-2 ${
            direction === "left" ? "ml-3 pl-3 pr-4" : "mr-3 pr-3 pl-4"
          }`}
          whileTap={{ scale: 0.95, rotate: direction === "left" ? -2 : 2 }}
        >
          {direction === "left" ? (
            <>
              <PanelRightOpen size={18} className="text-primary" />
              <span className="text-sm font-medium">Games</span>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">Games</span>
              <PanelLeftOpen size={18} className="text-primary" />
            </>
          )}
        </motion.button>
      </motion.div>
    );
  }

  // If neither section has items, return nothing.
  if (todayPreviews.length === 0 && upcomingPreviews.length === 0) return null;

  const initialX = direction === "left" ? -50 : 50;
  const exitX = direction === "left" ? -100 : 100;
  const shouldBeOpen = manuallyOpened || isCardHovered || bannerClicked;
  const effectiveMode = shouldBeOpen ? "open" : isHovered ? "open" : mode;
  const animate = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30, duration: 0.2 },
    },
    peek: {
      x: direction === "left" ? -40 : 40,
      opacity: 0.9,
      transition: { ease: "easeInOut", duration: 0.6 },
    },
    hidden: {
      x: direction === "left" ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Determine which previews to show per section based on expanded state.
  const todayToShow =
    !todayExpanded && todayPreviews.length > PREVIEW_LIMIT
      ? todayPreviews.slice(0, PREVIEW_LIMIT)
      : todayPreviews;
  const upcomingToShow =
    !upcomingExpanded && upcomingPreviews.length > PREVIEW_LIMIT
      ? upcomingPreviews.slice(0, PREVIEW_LIMIT)
      : upcomingPreviews;

  return (
    <AnimatePresence>
      {effectiveMode !== "hidden" && (
        <motion.div
          key={`${direction}Banner`}
          initial={{ x: initialX, opacity: 0 }}
          animate={animate[effectiveMode]}
          exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
          style={{ top: `${topPosition}px`, bottom: 0, height: `calc(100vh - ${topPosition}px)` }}
          className={`fixed ${direction === "right" ? "right-0" : "left-0"} max-w-[350px] w-[90%] bg-background p-4 shadow-lg z-40 overflow-auto transition-all border-2 border-border`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Banner Header */}
          <div className="sticky top-0 left-0 right-0 bg-background pb-3 z-10 border-b border-border mb-3 flex justify-between items-center">
            {direction === "left" ? (
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                  {todayPreviews.length}
                </div>
                <h3 className="font-medium text-sm">Today's Games</h3>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">Upcoming Games</h3>
                <div className="bg-primary/10 text-primary text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                  {upcomingPreviews.length}
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setManuallyClosed(true);
                setManuallyOpened(false);
                setBannerClicked(false);
              }}
              className="hover:bg-muted p-2 rounded-full transition-colors"
              aria-label="Close panel"
            >
              <X size={16} />
            </button>
          </div>
          {/* Subdivided Content */}
          <div className="space-y-6">
            {/* Section for Today's Games */}
            <div>
              <h4 className="mb-2 text-sm font-semibold">Today's Games</h4>
              <div className="flex flex-col gap-3">
                {todayPreviews.length === 0 ? (
                  <p className="text-xs text-center">No games today.</p>
                ) : (
                  todayToShow.map((preview, index) => {
                    const gameTime = new Date(preview.commence_time);
                    const dateFormat = "h:mm a";
                    return (
                      <motion.div
                        key={preview._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          y: -2,
                          transition: { duration: 0.1 },
                        }}
                        className="transition-all relative cursor-pointer"
                        onClick={() => router.push(`/gamedetails/${preview._id}`)}
                      >
                        <div className="p-3 bg-card shadow-sm hover:shadow-md rounded-md border border-border relative overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary to-secondary"
                            style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
                          ></div>
                          <div className="flex items-center gap-2">
                            <img
                              src={getTeamLogo(preview.away_team)}
                              alt={`${preview.away_team} logo`}
                              className="w-6 h-6"
                            />
                            <span className="text-sm font-semibold truncate">
                              {preview.away_team}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <img
                              src={getTeamLogo(preview.home_team)}
                              alt={`${preview.home_team} logo`}
                              className="w-6 h-6"
                            />
                            <span className="text-sm font-semibold truncate">
                              {preview.home_team}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            {/* Green Glowing Indicator */}
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">Today, {format(gameTime, dateFormat)}</span>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
              {todayPreviews.length > PREVIEW_LIMIT && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setTodayExpanded(!todayExpanded)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {todayExpanded ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}
            </div>

            {/* Section for Upcoming Games */}
            <div>
              <h4 className="mb-2 text-sm font-semibold">Upcoming Games</h4>
              <div className="flex flex-col gap-3">
                {upcomingPreviews.length === 0 ? (
                  <p className="text-xs text-center">No upcoming games.</p>
                ) : (
                  upcomingToShow.map((preview, index) => {
                    const gameTime = new Date(preview.commence_time);
                    const dateFormat = "MMM d, h:mm a";
                    return (
                      <motion.div
                        key={preview._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          y: -2,
                          transition: { duration: 0.1 },
                        }}
                        className="transition-all relative cursor-pointer"
                        onClick={() => router.push(`/gamedetails/${preview._id}`)}
                      >
                        <div className="p-3 bg-card shadow-sm hover:shadow-md rounded-md border border-border relative overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary to-secondary"
                            style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
                          ></div>
                          <div className="flex items-center gap-2">
                            <img
                              src={getTeamLogo(preview.away_team)}
                              alt={`${preview.away_team} logo`}
                              className="w-6 h-6"
                            />
                            <span className="text-sm font-semibold truncate">
                              {preview.away_team}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <img
                              src={getTeamLogo(preview.home_team)}
                              alt={`${preview.home_team} logo`}
                              className="w-6 h-6"
                            />
                            <span className="text-sm font-semibold truncate">
                              {preview.home_team}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs">{format(gameTime, dateFormat)}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
              {upcomingPreviews.length > PREVIEW_LIMIT && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setUpcomingExpanded(!upcomingExpanded)}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {upcomingExpanded ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewBanner;
