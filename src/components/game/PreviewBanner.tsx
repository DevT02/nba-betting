"use client";
import React, { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { getTeamLogo } from "@/lib/teamNameMap";
import { Clock, Calendar } from "lucide-react";
import { GamePreview } from "@/types/game";

type PreviewBannerProps = {
  todayPreviews: GamePreview[];
  upcomingPreviews: GamePreview[];
  headerHeight?: number;
};

const PreviewBanner: React.FC<PreviewBannerProps> = ({
  todayPreviews,
  upcomingPreviews,
  headerHeight = 80,
}) => {
  const router = useRouter();
  const [todayExpanded, setTodayExpanded] = useState(false);
  const [upcomingExpanded, setUpcomingExpanded] = useState(false);
  const PREVIEW_LIMIT = 3;

  // Create sorted arrays based on commence_time (ascending order)
  const sortedTodayPreviews = [...todayPreviews].sort(
    (a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()
  );
  const sortedUpcomingPreviews = [...upcomingPreviews].sort(
    (a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime()
  );

  // Limit displayed previews if not expanded.
  const todayToShow =
    !todayExpanded && sortedTodayPreviews.length > PREVIEW_LIMIT
      ? sortedTodayPreviews.slice(0, PREVIEW_LIMIT)
      : sortedTodayPreviews;
  const upcomingToShow =
    !upcomingExpanded && sortedUpcomingPreviews.length > PREVIEW_LIMIT
      ? sortedUpcomingPreviews.slice(0, PREVIEW_LIMIT)
      : sortedUpcomingPreviews;

  return (
    <div className="bg-card p-4 border rounded-lg shadow-sm overflow-auto">
      {/* Today's Games Section */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
          Today's Games
        </h3>
      </div>
      <div className="space-y-4">
        {sortedTodayPreviews.length === 0 ? (
          <p className="text-xs text-center">No games today.</p>
        ) : (
          todayToShow.map((preview) => {
            const gameTime = new Date(preview.commence_time);
            const dateFormat = "h:mm a";
            return (
              <div
                key={preview._id}
                onClick={() => router.push(`/gamedetails/${preview._id}`)}
                className="cursor-pointer p-3 bg-gradient-to-br shadow-sm hover:shadow-md rounded-md border border-border relative transition-all duration-200 hover:scale-[1.02] group"
              >
                <div
                  className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary to-secondary rounded-md pointer-events-none"
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
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
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Clock className="h-3 w-3" /> {/* text-emerald-400 */}
                  <span className="text-xs"> {/* text-emerald-400 */}
                    Today, {format(gameTime, dateFormat)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {sortedTodayPreviews.length > PREVIEW_LIMIT && (
          <div className="text-center">
            <button
              onClick={() => setTodayExpanded(!todayExpanded)}
              className="text-sm text-blue-500 hover:underline"
            >
              {todayExpanded ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
      <hr className="my-4 border-border" />
      {/* Upcoming Games Section */}
      <div className="mb-4">
        <h3 className="ml-1 text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
          Upcoming Games
        </h3>
      </div>
      <div className="space-y-4">
        {sortedUpcomingPreviews.length === 0 ? (
          <p className="text-xs text-center">No upcoming games.</p>
        ) : (
          upcomingToShow.map((preview) => {
            const gameTime = new Date(preview.commence_time);
            const dateFormat = "MMM d, h:mm a";
            return (
              <div
                key={preview._id}
                onClick={() => router.push(`/gamedetails/${preview._id}`)}
                className="cursor-pointer p-3 bg-gradient-to-br shadow-sm hover:shadow-md rounded-md border border-border relative transition-all duration-200 hover:scale-[1.02] group"
              >
                <div
                  className="absolute inset-0 opacity-5 bg-gradient-to-br from-primary to-secondary rounded-md pointer-events-none"
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
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
            );
          })
        )}
        {sortedUpcomingPreviews.length > PREVIEW_LIMIT && (
          <div className="text-center">
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
  );
};

export default PreviewBanner;
