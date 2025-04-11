import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdjacentGameNavigation(
  gameIds: string[] | undefined,
  currentGameId: string | undefined,
  gamePreviews: Record<string, { commence_time: string }>
) {
  const router = useRouter();

  // a game is scheduled for today.
  const isToday = (id: string) => {
    const game = gamePreviews[id];
    if (!game) return false;
    const gameTime = new Date(game.commence_time);
    return gameTime.toDateString() === new Date().toDateString();
  };

  // determine if a game is upcoming
  const isUpcoming = (id: string) => {
    const game = gamePreviews[id];
    if (!game) return false;
    const gameTime = new Date(game.commence_time);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    return gameTime > endOfToday;
  };

  // Filter out any game IDs that are not today or upcoming, and sort them by the scheduled commence_time (earliest first).
  const filteredGameIds = gameIds
    ? gameIds
        .filter(id => isToday(id) || isUpcoming(id))
        .sort((a, b) => {
          const timeA = new Date(gamePreviews[a].commence_time).getTime();
          const timeB = new Date(gamePreviews[b].commence_time).getTime();
          return timeA - timeB;
        })
    : [];

  // Custom navigation logic using the filtered & sorted list.
  const getAdjacentGameId = (direction: "prev" | "next"): string | null => {
    if (!filteredGameIds.length || !currentGameId) return null;
    const currentIndex = filteredGameIds.indexOf(currentGameId);
    if (currentIndex === -1) return null;
    
    const total = filteredGameIds.length;
    if (direction === "prev") {
      // Wrap around: if at the first element, return the last one.
      return filteredGameIds[(currentIndex - 1 + total) % total];
    } else if (direction === "next") {
      // Wrap around: if at the last element, return the first one.
      return filteredGameIds[(currentIndex + 1) % total];
    }
    
    return null;
  };

  useEffect(() => {
    if (!filteredGameIds.length || !currentGameId) return;
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
  }, [filteredGameIds, currentGameId, router]);

  return { getAdjacentGameId };
}
