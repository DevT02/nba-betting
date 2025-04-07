"use client";
import { useState, useEffect } from "react";

export function useUserTimeZone() {
  // Start with null so the consumer knows we're still loading.
  const [timeZone, setTimeZone] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Optionally check localStorage first if you want persistence.
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
