import { useState, useEffect } from "react";

export function useUserTimeZone() {
  const defaultTz =
    typeof window !== "undefined"
      ? localStorage.getItem("userTimeZone") || "UTC"
      : "UTC";
  const [timeZone, setTimeZone] = useState(defaultTz);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimeZone(tz);
      localStorage.setItem("userTimeZone", tz);
    }
  }, []);

  return timeZone;
}
