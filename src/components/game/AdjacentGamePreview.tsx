import React from "react";
import { getTeamLogo } from "@/lib/teamNameMap";
import { format } from "date-fns";

export type GamePreview = {
  _id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
};

export const AdjacentGamePreview: React.FC<{ game: GamePreview }> = ({ game }) => {
  const gameTime = new Date(game.commence_time);
  return (
    <div className="p-2 bg-white dark:bg-gray-800 shadow-md rounded-md">
      <div className="flex items-center gap-2">
        <img
          src={getTeamLogo(game.away_team)}
          alt={`${game.away_team} logo`}
          className="w-6 h-6"
        />
        <span className="text-sm font-semibold">{game.away_team}</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <img
          src={getTeamLogo(game.home_team)}
          alt={`${game.home_team} logo`}
          className="w-6 h-6"
        />
        <span className="text-sm font-semibold">{game.home_team}</span>
      </div>
      <p className="text-xs mt-1">
        {format(gameTime, "EEE, MMM d, h:mm a")}
      </p>
    </div>
  );
};
