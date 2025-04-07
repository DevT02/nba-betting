"use client";
import { useUserTimeZone } from "@/hooks/useUserTimeZone";
import GamesGrid from "./GamesGrid";
import GamesGridSkeleton from "./GamesGridSkeleton";

type Props = {
  games: any[];
  activeTab: string;
};

export default function GamesGridWrapper({ games, activeTab }: Props) {
  const userTimeZone = useUserTimeZone();
  if (userTimeZone === null) {
    return <GamesGridSkeleton />;
  }

  return <GamesGrid games={games} activeTab={activeTab} />;
}
