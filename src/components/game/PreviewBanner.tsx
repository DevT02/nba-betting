"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getTeamLogo } from "@/lib/teamNameMap";
import { GamePreview } from "@/types/game";

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

  const initialX = direction === "left" ? -50 : 50;
  const exitX = direction === "left" ? -100 : 100;
  const animate =
    mode === "open"
      ? { x: 0, opacity: 1 }
      : mode === "peek"
      ? {
          x: [initialX, direction === "left" ? -40 : 40, initialX],
          opacity: 1,
          transition: { repeat: Infinity, duration: 1.5 },
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
          // Use headerHeight to set the top offset so the banner appears below the header.
          style={{ top: `${headerHeight}px` }}
          className={`fixed ${direction}-0 bottom-0 w-[300px] sm:w-1/4 bg-gray-100 dark:bg-gray-700 p-4 shadow-xl z-40 cursor-pointer`}
        >
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
                      <span className="text-sm font-semibold">
                        {preview.away_team}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={getTeamLogo(preview.home_team)}
                        alt={`${preview.home_team} logo`}
                        className="w-6 h-6"
                      />
                      <span className="text-sm font-semibold">
                        {preview.home_team}
                      </span>
                    </div>
                    <p className="text-xs mt-1">
                      {format(gameTime, "EEE, MMM d, h:mm a")}
                    </p>
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
