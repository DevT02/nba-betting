import { useEffect, useState } from "react";
export type BannerMode = "hidden" | "peek" | "open";
export function usePreviewMode() {
  const [leftBannerMode, setLeftBannerMode] = useState<BannerMode>("hidden");
  const [rightBannerMode, setRightBannerMode] = useState<BannerMode>("hidden");
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 150) {
        setLeftBannerMode("open");
      } else if (e.clientX < 300) {
        setLeftBannerMode("peek");
      } else {
        setLeftBannerMode("hidden");
      }
      if (e.clientX > window.innerWidth - 150) {
        setRightBannerMode("open");
      } else if (e.clientX > window.innerWidth - 300) {
        setRightBannerMode("peek");
      } else {
        setRightBannerMode("hidden");
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return { leftBannerMode, rightBannerMode, setLeftBannerMode, setRightBannerMode };
}
