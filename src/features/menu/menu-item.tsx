import { useRef, useState } from "react";
import Button from "../../ui/button";
import { formatCurrency } from "../../utils/helpers";
import type { Pizza } from "../../utils/types";
import { addItem, getCart, type NewCartItem } from "../cart/cart-slice";
import { useAppDispatch, useAppSelector } from "../../store";
import UpdateItemQuantity from "../cart/update-item-quantity";
import { flyToCart } from "../../utils/fly-to-cart";
import { hasFish, hasMeat, isSpicy, isVegetarian } from "./menu-filters";
import CustomizePizza from "./customize-pizza";
import { describeCustomization } from "../../utils/cart-line";
import { useCartActions } from "../cart/use-cart-actions";
import { useToast } from "../../ui/toast-context";

// Wraps the part of the text that matches the search in an accent color
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const start = q ? text.toLowerCase().indexOf(q) : -1;
  if (start === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-sm bg-accent/15 text-ink">{text.slice(start, start + q.length)}</mark>
      {text.slice(start + q.length)}
    </>
  );
}

interface MenuItemProps {
  pizza: Pizza;
  highlight?: string;
  allIngredients: string[];
}

function MenuItem({ pizza, highlight = "", allIngredients }: MenuItemProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const imageRef = useRef<HTMLImageElement>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;

  const { removePizza } = useCartActions();

  // Every version of this pizza in the cart (plain and customized). The − / + buttons
  // show their total and act on the most recently added version.
  const cart = useAppSelector(getCart);
  const lines = cart.filter((line) => line.pizzaId === id);
  const currentQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const latestLine = lines[lines.length - 1];
  const isInCart = currentQuantity > 0;
  const vegetarian = isVegetarian(pizza);
  const spicy = isSpicy(pizza);
  const meat = hasMeat(pizza);
  const fish = hasFish(pizza);

  function handleAddToCart() {
    dispatch(addItem({ pizzaId: id, name, quantity: 1, unitPrice, imageUrl, addIngredients: [], removeIngredients: [] }))
    flyToCart(imageRef.current)
  }

  function handleAddCustomized(item: NewCartItem) {
    setIsCustomizing(false);
    dispatch(addItem(item));
    flyToCart(imageRef.current);

    const details = describeCustomization(item.addIngredients, item.removeIngredients);
    toast({ message: `${item.quantity > 1 ? `${item.quantity} × ` : ""}${name} added${details ? ` · ${details.toLowerCase()}` : ""}` });
  }

  return (
    <li className="flex gap-5 border-b border-line py-6">
      <div className="relative shrink-0">
        <img
          ref={imageRef}
          src={imageUrl}
          alt={name}
          width={112}
          height={112}
          loading="lazy"
          className={`h-24 w-24 rounded-full object-cover ring-1 ring-line sm:h-28 sm:w-28 ${soldOut ? "opacity-60 grayscale" : ""}`}
        />
        {isInCart && (
          <span className="absolute -right-1 -top-1 grid h-7 min-w-7 place-items-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-ink ring-2 ring-bg">
            {currentQuantity}
          </span>
        )}
      </div>

      <div className="flex min-w-0 grow flex-col">
        {/* Classic menu line: name, dotted leader, price */}
        <div className="flex items-baseline gap-2">
          <h3 className="font-display text-2xl leading-tight">
            <Highlight text={name} query={highlight} />
          </h3>
          <span aria-hidden="true" className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-muted/40" />
          {soldOut ? (
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.2em] text-muted">Sold out</span>
          ) : (
            <span className="shrink-0 tabular-nums">{formatCurrency(unitPrice)}</span>
          )}
        </div>

        <p className="mt-1 text-sm capitalize italic text-muted">
          {ingredients.map((ingredient, i) => (
            <span key={ingredient}>
              {i > 0 && ", "}
              <Highlight text={ingredient} query={highlight} />
            </span>
          ))}
        </p>

        {(vegetarian || meat || fish || spicy) && (
          <div className="mt-2 flex flex-wrap gap-3 text-[0.65rem] font-medium uppercase tracking-[0.2em]">
            {vegetarian && (
              <span className="inline-flex items-center gap-1 text-success">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                </svg>
                Vegetarian
              </span>
            )}
            {meat && (
              <span className="inline-flex items-center gap-1 text-ink/75">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3.5a5.5 5.5 0 0 1 0 11c-1.2 0-2.3-.4-3.2-1l-3.6 3.6a2 2 0 1 1-2.6 2.6 2 2 0 1 1-2.5-2.6 2 2 0 0 1 2.4-.2l3.6-3.6A5.5 5.5 0 0 1 15 3.5Z" />
                </svg>
                Meat
              </span>
            )}
            {fish && (
              <span className="inline-flex items-center gap-1 text-ink/75">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 12c2.5-3.5 6-5 10-4.5L18 4v16l-5-3.5C9 17 5.5 15.5 3 12Z" />
                  <circle cx="8" cy="11" r=".6" fill="currentColor" />
                </svg>
                Fish
              </span>
            )}
            {spicy && (
              <span className="inline-flex items-center gap-1 text-accent">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 6c3 0 5 2 5 5 0 5-6 9-12 9 3-2 4-5 4-8 0-3 1-6 3-6Z" />
                  <path d="M14 6c0-2 1-3 3-3" />
                </svg>
                Spicy
              </span>
            )}
          </div>
        )}

        {lines.length > 1 && (
          <p className="mt-2 text-xs text-muted">{lines.length} versions in your cart · see the cart for details</p>
        )}

        {!soldOut && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            {latestLine ? (
              <UpdateItemQuantity lineId={latestLine.lineId} currentQuantity={currentQuantity} />
            ) : (
              <Button type="small" onClick={handleAddToCart}>
                Add to cart
              </Button>
            )}

            <div className="flex items-center gap-3">
              <Button type="ghost" onClick={() => setIsCustomizing(true)}>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                  <circle cx="16" cy="7" r="2" />
                  <circle cx="10" cy="17" r="2" />
                </svg>
                Customize
              </Button>
              {isInCart && (
                <Button type="ghost" onClick={() => removePizza(id)}>
                  Remove
                </Button>
              )}
            </div>
          </div>
        )}

        {isCustomizing && (
          <CustomizePizza
            pizza={pizza}
            allIngredients={allIngredients}
            onClose={() => setIsCustomizing(false)}
            onAdd={handleAddCustomized}
          />
        )}
      </div>
    </li>
  );
}

export default MenuItem;
