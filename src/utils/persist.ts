import type { CartItemData, SavedOrder } from "./types";
import { makeLineId } from "./cart-line";

// Keeps the cart, the customer's name and their order history in localStorage,
// so a page reload doesn't lose them. Only plain data is saved, never loading/error state.

const STORAGE_KEY = "verona-state";
const VERSION = 1;
const MAX_SAVED_ORDERS = 20;

export type PersistedState = {
  username: string;
  cart: CartItemData[];
  orders: SavedOrder[];
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string");

// Accepts carts saved before customization existed and fills in the new fields
function toCartItem(value: unknown): CartItemData | null {
  if (typeof value !== "object" || value === null) return null;
  const item = value as Record<string, unknown>;
  if (
    typeof item.pizzaId !== "number" ||
    typeof item.name !== "string" ||
    typeof item.quantity !== "number" ||
    typeof item.unitPrice !== "number" ||
    typeof item.totalPrice !== "number"
  )
    return null;

  const addIngredients = isStringArray(item.addIngredients) ? item.addIngredients : [];
  const removeIngredients = isStringArray(item.removeIngredients) ? item.removeIngredients : [];
  return {
    lineId: makeLineId(item.pizzaId, addIngredients, removeIngredients),
    pizzaId: item.pizzaId,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    addIngredients,
    removeIngredients,
    imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : undefined,
  };
}

function isSavedOrder(value: unknown): value is SavedOrder {
  if (typeof value !== "object" || value === null) return false;
  const order = value as Record<string, unknown>;
  return (
    typeof order.id === "string" &&
    typeof order.createdAt === "string" &&
    typeof order.estimatedDelivery === "string" &&
    typeof order.total === "number" &&
    Array.isArray(order.items)
  );
}

let cached: PersistedState | null | undefined;

export function loadPersistedState(): PersistedState | null {
  if (cached !== undefined) return cached;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    // Ignore anything that doesn't look like what we saved (other versions, manual edits)
    if (parsed?.version !== VERSION || typeof parsed.username !== "string" || !Array.isArray(parsed.cart)) {
      cached = null;
    } else {
      const cart = parsed.cart.map(toCartItem);
      cached = cart.every(Boolean)
        ? {
            username: parsed.username,
            cart: cart as CartItemData[],
            orders: Array.isArray(parsed.orders) ? parsed.orders.filter(isSavedOrder) : [],
          }
        : null;
    }
  } catch {
    // Storage can be blocked (private mode) or hold invalid JSON
    cached = null;
  }

  return cached;
}

export function savePersistedState(state: PersistedState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: VERSION, ...state, orders: state.orders.slice(0, MAX_SAVED_ORDERS) })
    );
  } catch {
    // Quota or privacy settings; the app still works, it just won't remember
  }
}
