import { useEffect, useState } from "react";

// The current time, updated every `intervalMs`. Pass null to stop ticking.
export function useNow(intervalMs: number | null = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (intervalMs === null) return;
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
