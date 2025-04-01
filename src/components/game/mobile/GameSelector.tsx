"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { getTeamLogo } from "@/lib/teamNameMap"; 
import { GamePreview } from "@/types/game";

type GameSelectorProps = {
  games: GamePreview[];
  currentGameId?: string;
};

const GameSelector = ({ games, currentGameId }: GameSelectorProps) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (currentRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const element = currentRef.current;
      const scrollLeft = element.offsetLeft - (container.clientWidth / 2) + (element.clientWidth / 2);
      container.scrollLeft = scrollLeft;
    }
  }, [currentGameId]);

  if (!games || games.length === 0) return null;

  return (
    <div className="mb-4 relative">
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto py-2 px-1 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {games.map((game) => {
          const isCurrentGame = game._id === currentGameId;
          const gameTime = new Date(game.commence_time);
          
          return (
            <button
              key={game._id}
              ref={isCurrentGame ? currentRef : null}
              onClick={() => router.push(`/gamedetails/${game._id}`)}
              className={`flex-shrink-0 flex items-center gap-1 mx-1 px-3 py-2 rounded-full border snap-center whitespace-nowrap
                ${isCurrentGame 
                  ? "bg-blue-500 text-white border-blue-600" 
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                }`}
            >
              <div className="flex items-center gap-1.5">
                <img 
                  src={getTeamLogo(game.away_team)} 
                  alt={game.away_team} 
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs font-medium">
                  {game.away_team.split(' ').pop()}
                </span>
              </div>
              <span className="text-xs mx-1">vs</span>
              <div className="flex items-center gap-1.5">
                <img 
                  src={getTeamLogo(game.home_team)} 
                  alt={game.home_team} 
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs font-medium">
                  {game.home_team.split(' ').pop()}
                </span>
              </div>
              <span className="text-[10px] ml-1">
                {format(gameTime, "h:mm a")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameSelector;