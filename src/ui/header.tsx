import { Link, NavLink } from "react-router-dom";
import SearchOrder from "../features/order/search-order";
import Username from "../features/user/username";
import Logo from "./logo";
import ThemeToggle from "./theme-toggle";
import { useScrolled } from "../hooks/use-scrolled";

function Header() {
  // At the very top the header blends into the page; once scrolled it gets a border
  const scrolled = useScrolled();

  return (
    <header
      className={`site-header sticky top-0 z-40 border-b bg-bg/70 backdrop-blur-xl backdrop-saturate-150 transition-colors duration-300 ${scrolled ? "border-line" : "border-transparent"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          viewTransition
          aria-label="Verona home"
          className="shrink-0 rounded-md focus:outline-none focus-visible:ring focus-visible:ring-accent/40"
        >
          <Logo />
        </Link>

        <SearchOrder />

        <div className="flex items-center gap-1 sm:gap-4">
          {/* Baseline-aligned so the small caps "MENU" and the greeting sit on one line */}
          <div className="hidden items-baseline gap-4 md:flex">
            {[
              { to: "/menu", label: "Menu" },
              { to: "/orders", label: "Orders" },
            ].map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                viewTransition
                className={({ isActive }) =>
                  `text-xs font-medium uppercase tracking-[0.25em] transition-colors hover:text-accent ${isActive ? "text-accent" : "text-muted"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Username />
          </div>
          {/* On small screens "My orders" is an icon, since the header has no room for words */}
          <NavLink
            to="/orders"
            viewTransition
            aria-label="My orders"
            className={({ isActive }) =>
              `grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-subtle hover:text-ink focus:outline-none focus-visible:ring focus-visible:ring-accent/40 md:hidden ${isActive ? "text-accent" : "text-muted"}`
            }
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3v-17Z" />
              <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
            </svg>
          </NavLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
