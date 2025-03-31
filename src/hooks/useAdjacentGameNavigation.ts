import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAdjacentGameNavigation(gameIds: string[] | undefined, currentGameId: string | undefined) {
  const router = useRouter();

  const getAdjacentGameId = (direction: "prev" | "next"): string | null => {
    if (!gameIds || !currentGameId) return null;
    const index = gameIds.indexOf(currentGameId);
    if (index === -1) return null;
    const newIndex = direction === "prev" ? index - 1 : index + 1;
    return gameIds[newIndex] || null;
  };

  useEffect(() => {
    if (!gameIds || !currentGameId) return;
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
  }, [gameIds, currentGameId, router]);

  return { getAdjacentGameId };
}
