// * Extras are charged per topping; taking toppings off is free
export const EXTRA_TOPPING_PRICE = 1.5;

export function priceWithExtras(basePrice: number, extraCount: number) {
  return basePrice + extraCount * EXTRA_TOPPING_PRICE;
}

export function makeLineId(pizzaId: number, addIngredients: string[] = [], removeIngredients: string[] = []) {
  const add = [...addIngredients].sort().join(",");
  const remove = [...removeIngredients].sort().join(",");
  return `${pizzaId}|${add}|${remove}`;
}

export function describeCustomization(addIngredients: string[] = [], removeIngredients: string[] = []) {
  const parts: string[] = [];
  if (removeIngredients.length) parts.push(`No ${removeIngredients.join(", ")}`);
  if (addIngredients.length) parts.push(`Extra ${addIngredients.join(", ")}`);
  return parts.join(" · ");
}
