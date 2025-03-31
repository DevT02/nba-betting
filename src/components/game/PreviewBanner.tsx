"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getTeamLogo } from "@/lib/teamNameMap";
import { GamePreview } from "@/types/game";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PreviewBannerProps = {
  direction: "left" | "right";
  previews: GamePreview[];
  mode: "hidden" | "peek" | "open";
  headerHeight?: number;
};

const PreviewBanner: React.FC<PreviewBannerProps> = ({
  direction,
  previews,
  mode,
  headerHeight = 80,
}) => {
  const router = useRouter();
  const [manuallyClosed, setManuallyClosed] = React.useState(false);

  if (manuallyClosed) {
    return (
      <div className={`fixed ${direction}-0 top-1/2 transform -translate-y-1/2 z-40`}>
        <button
          onClick={() => setManuallyClosed(false)}
          className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700"
        >
          {direction === "right" ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
    );
  }

  if (!previews.length) return null;
  const initialX = direction === "left" ? -50 : 50;
  const exitX = direction === "left" ? -100 : 100;
  const animate =
    mode === "open"
      ? { x: 0, opacity: 1, transition: { duration: 0.3 } }
      : mode === "peek"
      ? {
          x: direction === "left" ? -40 : 40,
          opacity: 1,
          transition: { ease: "easeInOut", duration: 1.5, yoyo: Infinity },
        }
      : {};

  return (
    <AnimatePresence>
      {mode !== "hidden" && (
        <motion.div
        key={`${direction}Banner`}
        initial={{ x: initialX, opacity: 0 }}
        animate={animate}
        exit={{ x: exitX, opacity: 0, transition: { duration: 0.5 } }}
        style={{ top: `${headerHeight}px` }}
        className={`fixed ${direction === "right" ? "right-0" : "left-0"} bottom-0 ${
          direction === "right" ? "sm:max-w-[20%]" : "sm:max-w-[20%]"
          } max-w-[350px] w-[90%] bg-gray-100 dark:bg-gray-900 p-4 shadow-xl z-40 cursor-pointer`}
        >
          {/* Toggle button positioned at inner edge */}
          <button
            onClick={() => setManuallyClosed(true)}
            className={`absolute top-1/2 transform -translate-y-1/2 ${
              direction === "right" ? "left-[-20px]" : "right-[-20px]"
            } p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700`}
          >
            {direction === "right" ? <ChevronLeft /> : <ChevronRight />}
          </button>
          <div className="flex flex-col space-y-4">
            {previews.map((preview) => {
              const gameTime = new Date(preview.commence_time);
              return (
                <motion.div
                  key={preview._id}
                  whileHover={{ scale: 1.05 }}
                  className="transition-transform"
                  onClick={() => router.push(`/gamedetails/${preview._id}`)}
                >
                  <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md">
                    <div className="flex items-center gap-2">
                      <img
                        src={getTeamLogo(preview.away_team)}
                        alt={`${preview.away_team} logo`}
                        className="w-6 h-6"
                      />
                      <span className="text-sm font-semibold">{preview.away_team}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={getTeamLogo(preview.home_team)}
                        alt={`${preview.home_team} logo`}
                        className="w-6 h-6"
                      />
                      <span className="text-sm font-semibold">{preview.home_team}</span>
                    </div>
                    <p className="text-xs mt-1">{format(gameTime, "EEE, MMM d, h:mm a")}</p>
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
