import { useEffect, useState } from "react";

// True once the page has scrolled past `offset` pixels. Used to show the
// header's bottom border only after the user starts scrolling.
export function useScrolled(offset = 4) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > offset);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > offset);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return scrolled;
}
