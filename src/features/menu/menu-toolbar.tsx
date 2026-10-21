import { DIET_OPTIONS, SORT_OPTIONS, type Diet, type MenuFilters, type SortOrder } from "./menu-filters";

interface MenuToolbarProps {
  filters: MenuFilters;
  dietCounts: Record<Diet, number>;
  onChange: (changes: Partial<MenuFilters>) => void;
}

const pill = "shrink-0 whitespace-nowrap rounded-full border text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-accent/40";

function MenuToolbar({ filters, dietCounts, onChange }: MenuToolbarProps) {
  const soldOutToggle = (
    <label className={`${pill} flex cursor-pointer select-none items-center gap-2 border-line px-3 py-2 text-muted hover:text-ink`}>
      <input
        type="checkbox"
        checked={filters.hideSoldOut}
        onChange={(e) => onChange({ hideSoldOut: e.target.checked })}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-4 w-7 rounded-full bg-line transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-3 after:w-3 after:rounded-full after:bg-surface after:transition-transform peer-checked:bg-accent peer-checked:after:translate-x-3 peer-focus-visible:ring peer-focus-visible:ring-accent/40"
      />
      Hide sold out
    </label>
  );

  const sortSelect = (
    <label className="relative flex min-w-0 flex-1 items-center sm:flex-none">
      <span className="sr-only">Sort pizzas</span>
      <select
        value={filters.sort}
        onChange={(e) => onChange({ sort: e.target.value as SortOrder })}
        className={`${pill} h-full w-full cursor-pointer appearance-none border-line bg-transparent py-2 pl-4 pr-9 text-muted hover:text-ink`}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-surface text-ink">
            {option.label}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: search, plus the extra controls on large screens */}
      <div className="flex items-stretch gap-3">
        <div className="relative min-w-0 flex-1">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <label htmlFor="menu-search" className="sr-only">Search pizzas or ingredients</label>
          <input
            id="menu-search"
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Search pizzas or ingredients"
            autoComplete="off"
            className="input w-full !pl-11 pr-10 [&::-webkit-search-cancel-button]:hidden"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onChange({ query: "" })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink"
            >
              &times;
            </button>
          )}
        </div>

        <div className="hidden shrink-0 items-stretch gap-3 lg:flex">
          {soldOutToggle}
          {sortSelect}
        </div>
      </div>

      {/* Row 2: diet filters, plus the extra controls below large screens. Wraps instead of overflowing */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div role="group" aria-label="Filter by diet" className="grid grid-cols-3 gap-2 sm:flex">
          {DIET_OPTIONS.map((option) => {
            const isActive = filters.diet === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => onChange({ diet: option.value })}
                className={`${pill} px-2 py-2 !text-[0.68rem] !tracking-[0.08em] sm:px-4 sm:!text-xs sm:!tracking-[0.16em] ${isActive
                  ? "border-ink bg-ink text-bg"
                  : "border-line text-muted hover:border-ink/40 hover:text-ink"
                  }`}
              >
                {option.label}
                {/* Counts are hidden on small phones, where the three buttons share one row */}
                <span className="ml-1.5 hidden tabular-nums opacity-60 min-[420px]:inline">{dietCounts[option.value]}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {soldOutToggle}
          {sortSelect}
        </div>
      </div>
    </div>
  );
}

export default MenuToolbar;
