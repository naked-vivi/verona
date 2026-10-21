import type { Pizza } from "../../utils/types";

// * The API has no categories, so tags are derived from ingredients

const MEAT = ["ham", "prosciutto", "salami", "pepperoni", "chicken"];
const FISH = ["anchovies"];
const MEAT_OR_FISH = [...MEAT, ...FISH];
const SPICY = ["spicy salami", "chili flakes", "pepperoncini"];

export function isVegetarian(pizza: Pizza) {
  return !pizza.ingredients.some((ing) => MEAT_OR_FISH.some((meat) => ing.toLowerCase().includes(meat)));
}

function hasAny(pizza: Pizza, list: string[]) {
  return pizza.ingredients.some((ing) => list.some((item) => ing.toLowerCase().includes(item)));
}

export function hasMeat(pizza: Pizza) {
  return hasAny(pizza, MEAT);
}

export function hasFish(pizza: Pizza) {
  return hasAny(pizza, FISH);
}

export function isSpicy(pizza: Pizza) {
  return pizza.ingredients.some((ing) => SPICY.includes(ing.toLowerCase()));
}

export type Diet = "all" | "veg" | "meat";
export type SortOrder = "featured" | "price-asc" | "price-desc" | "name";

export type MenuFilters = {
  query: string;
  diet: Diet;
  hideSoldOut: boolean;
  sort: SortOrder;
};

export const DIET_OPTIONS: { value: Diet; label: string }[] = [
  { value: "all", label: "All" },
  { value: "veg", label: "Vegetarian" },
  { value: "meat", label: "Meat & fish" },
];

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name: A to Z" },
];

export function readFilters(params: URLSearchParams): MenuFilters {
  const diet = params.get("diet");
  const sort = params.get("sort");
  return {
    query: params.get("q") ?? "",
    diet: DIET_OPTIONS.some((o) => o.value === diet) ? (diet as Diet) : "all",
    hideSoldOut: params.get("soldout") === "hide",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortOrder) : "featured",
  };
}

export function matchesDiet(pizza: Pizza, diet: Diet) {
  if (diet === "veg") return isVegetarian(pizza);
  if (diet === "meat") return !isVegetarian(pizza);
  return true;
}

export function matchesQuery(pizza: Pizza, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return pizza.name.toLowerCase().includes(q) || pizza.ingredients.some((ing) => ing.toLowerCase().includes(q));
}

export function filterMenu(menu: Pizza[], filters: MenuFilters) {
  const list = menu.filter(
    (pizza) =>
      !(filters.hideSoldOut && pizza.soldOut) &&
      matchesDiet(pizza, filters.diet) &&
      matchesQuery(pizza, filters.query)
  );

  switch (filters.sort) {
    case "price-asc":
      return list.sort((a, b) => a.unitPrice - b.unitPrice || a.name.localeCompare(b.name));
    case "price-desc":
      return list.sort((a, b) => b.unitPrice - a.unitPrice || a.name.localeCompare(b.name));
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return list.sort((a, b) => Number(a.soldOut) - Number(b.soldOut));
  }
}
