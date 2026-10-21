import { useLoaderData, useSearchParams, type ShouldRevalidateFunctionArgs } from "react-router-dom";
import { getMenu } from "../../services/api-restaurant";
import MenuItem from "./menu-item";
import MenuToolbar from "./menu-toolbar";
import { filterMenu, matchesDiet, matchesQuery, readFilters, type Diet, type MenuFilters } from "./menu-filters";
import type { Pizza } from "../../utils/types";
import useTitle from "../../hooks/use-title";

function Menu() {
  const menu: Pizza[] = useLoaderData();
  useTitle("Menu");
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);

  const visible = filterMenu(menu, filters);
  const soldOutCount = menu.filter((pizza) => pizza.soldOut).length;
  const allIngredients = [...new Set(menu.flatMap((pizza) => pizza.ingredients))].sort();

  const dietCounts = (["all", "veg", "meat"] as Diet[]).reduce(
    (counts, diet) => {
      counts[diet] = menu.filter(
        (pizza) =>
          !(filters.hideSoldOut && pizza.soldOut) && matchesDiet(pizza, diet) && matchesQuery(pizza, filters.query)
      ).length;
      return counts;
    },
    {} as Record<Diet, number>
  );

  const isFiltered = filters.query !== "" || filters.diet !== "all" || filters.hideSoldOut;

  function updateFilters(changes: Partial<MenuFilters>) {
    const next = { ...filters, ...changes };
    const params = new URLSearchParams();
    if (next.query) params.set("q", next.query);
    if (next.diet !== "all") params.set("diet", next.diet);
    if (next.hideSoldOut) params.set("soldout", "hide");
    if (next.sort !== "featured") params.set("sort", next.sort);
    // * replace: typing in the search shouldn't fill the browser history
    setSearchParams(params, { replace: true, preventScrollReset: true });
  }

  return (
    <div>
      <header className="mb-10 flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-accent">Il menu</p>
        <h1 className="font-display text-5xl leading-none md:text-6xl">Our pizzas</h1>
        <p className="max-w-xl text-muted">
          {menu.length - soldOutCount} pizzas ready for the oven today
          {soldOutCount > 0 && `, ${soldOutCount} sold out`}. Each one is baked to order.
        </p>
      </header>

      <MenuToolbar filters={filters} dietCounts={dietCounts} onChange={updateFilters} />

      <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted" aria-live="polite">
        {isFiltered ? `Showing ${visible.length} of ${menu.length}` : `${menu.length} pizzas`}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-2 grid gap-x-12 md:grid-cols-2">
          {visible.map((pizza) => (
            <MenuItem pizza={pizza} key={pizza.id} highlight={filters.query} allIngredients={allIngredients} />
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-3xl">No pizzas match</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            {filters.query
              ? `Nothing on the menu has “${filters.query.trim()}”. Try another ingredient, like mushrooms or olives.`
              : "Try a different filter."}
          </p>
          <button
            type="button"
            onClick={() => updateFilters({ query: "", diet: "all", hideSoldOut: false })}
            className="mt-6 text-xs font-medium uppercase tracking-[0.2em] text-accent hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export async function loader() {
  const menu = await getMenu()
  return menu;
}

// * Filter changes only touch the query string, so don't refetch the menu
export function shouldRevalidate({ currentUrl, nextUrl, formMethod, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
  if (!formMethod && currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
}

export default Menu;
