// Helpers for cart lines: the same pizza with different toppings is a different line.

// Each extra topping adds this to the pizza's price; taking toppings off is free.
// The API keeps the prices we send, so the order total includes extras too.
export const EXTRA_TOPPING_PRICE = 1.5;

export function priceWithExtras(basePrice: number, extraCount: number) {
  return basePrice + extraCount * EXTRA_TOPPING_PRICE;
}

export function makeLineId(pizzaId: number, addIngredients: string[] = [], removeIngredients: string[] = []) {
  const add = [...addIngredients].sort().join(",");
  const remove = [...removeIngredients].sort().join(",");
  return `${pizzaId}|${add}|${remove}`;
}

// "No basil · Extra olives, capers" (empty string for an unchanged pizza)
export function describeCustomization(addIngredients: string[] = [], removeIngredients: string[] = []) {
  const parts: string[] = [];
  if (removeIngredients.length) parts.push(`No ${removeIngredients.join(", ")}`);
  if (addIngredients.length) parts.push(`Extra ${addIngredients.join(", ")}`);
  return parts.join(" · ");
}
