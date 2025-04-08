"use client";
import { useState, useEffect } from "react";

export function useUserTimeZone() {
  const [timeZone, setTimeZone] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      //check localStorage first for persistence
      const stored = localStorage.getItem("userTimeZone");
      if (stored) {
        setTimeZone(stored);
      }
      // Then update to the actual resolved timezone.
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimeZone(tz);
      localStorage.setItem("userTimeZone", tz);
    }
  }, []);

  return timeZone;
}
