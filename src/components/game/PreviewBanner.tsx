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
  previews: GamePreview[];
  mode: "hidden" | "peek" | "open";
  headerHeight?: number;
  currentlyViewingTeam?: string;
};

const PreviewBanner: React.FC<PreviewBannerProps> = ({
  direction,
  previews,
  mode,
  headerHeight = 80,
  currentlyViewingTeam,
}) => {
  const router = useRouter();
  const [manuallyClosed, setManuallyClosed] = useState(false);
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [bannerClicked, setBannerClicked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
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
          className={`p-3 bg-card border border-border 
            rounded-lg hover:bg-muted shadow-sm transition-all 
            flex items-center gap-2 ${
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

  if (!previews.length) return null;

  const initialX = direction === "left" ? -50 : 50;
  const exitX = direction === "left" ? -100 : 100;

  // Allow peek mode when appropriate
  const shouldBeOpen = manuallyOpened || isCardHovered || bannerClicked;
  const effectiveMode = shouldBeOpen ? "open" : isHovered ? "open" : mode;

  // More natural animation settings
  const animate = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.2,
      },
    },
    peek: {
      x: direction === "left" ? -40 : 40,
      opacity: 0.9,
      transition: {
        ease: "easeInOut",
        duration: 0.6,
      },
    },
    hidden: {
      x: direction === "left" ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const gameCount = previews.length;
  const gameText = gameCount === 1 ? "game" : "games";

  return (
    <AnimatePresence>
      {effectiveMode !== "hidden" && (
        <motion.div
          key={`${direction}Banner`}
          initial={{ x: initialX, opacity: 0 }}
          animate={animate[effectiveMode]}
          exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
          style={{
            top: `${topPosition}px`,
            bottom: 0,
            height: `calc(100vh - ${topPosition}px)`,
          }}
          className={`fixed ${
            direction === "right" ? "right-0" : "left-0"
          } max-w-[350px] w-[90%] bg-background p-4 shadow-lg z-40 overflow-auto transition-all border-2 ${
            direction === "right" ? "" : ""
          } border-border`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="sticky top-0 left-0 right-0 bg-background pb-3 z-10 flex justify-between items-center border-b border-border mb-3">
            {direction === "left" ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                    {gameCount}
                  </div>
                  <h3 className="font-medium text-sm">NBA {gameText}</h3>
                </div>
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
              </>
            ) : (
              <>
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
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">NBA {gameText}</h3>
                  <div className="bg-primary/10 text-primary text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                    {gameCount}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col space-y-4 pt-2 pb-16">
            {previews.map((preview, index) => {
              const gameTime = new Date(preview.commence_time);
              const isToday = new Date().toDateString() === gameTime.toDateString();
              const dateFormat = isToday ? "h:mm a" : "EEE, MMM d, h:mm a";
              const isFeaturedTeam =
                currentlyViewingTeam &&
                (preview.home_team === currentlyViewingTeam ||
                  preview.away_team === currentlyViewingTeam);

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
                  onMouseEnter={() => setIsCardHovered(true)}
                  onMouseLeave={() => setIsCardHovered(false)}
                >
                  {/* Featured team indicator */}
                  {isFeaturedTeam && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background z-10"></div>
                  )}

                  <div className="p-3 bg-card shadow-sm hover:shadow-md rounded-md border border-border relative overflow-hidden">
                    {/* Background team accent color */}
                    <div
                      className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary to-secondary"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                      }}
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

                    {/* Enhanced time display with pulsing indicator for today's games */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {isToday ? (
                        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <Clock className="h-3 w-3" />
                          <span>Today, {format(gameTime, "h:mm a")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(gameTime, dateFormat)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreviewBanner;
