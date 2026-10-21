import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "verona-theme";

// The inline script in index.html sets the starting theme before React loads
function getInitialTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function hasSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Follow the system setting until the user picks a theme themselves
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    function handleChange(e: MediaQueryListEvent) {
      if (!hasSavedTheme()) setTheme(e.matches ? "dark" : "light");
    }
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  function handleToggle() {
    const next: Theme = isDark ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked (e.g. private mode); the toggle still works for this visit
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Verona by day" : "Notte all'Arena"}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors duration-300 hover:bg-subtle hover:text-ink focus:outline-none focus:ring focus:ring-accent/40"
    >
      {isDark ? (
        // Sun
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </svg>
      ) : (
        // Moon
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}

export default ThemeToggle;
