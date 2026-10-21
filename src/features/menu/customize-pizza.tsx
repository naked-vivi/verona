import { useEffect, useRef, useState } from "react";
import Button from "../../ui/button";
import { formatCurrency } from "../../utils/helpers";
import { describeCustomization, EXTRA_TOPPING_PRICE, priceWithExtras } from "../../utils/cart-line";
import type { Pizza } from "../../utils/types";
import type { NewCartItem } from "../cart/cart-slice";

const MAX_EXTRAS = 3;

interface CustomizePizzaProps {
  pizza: Pizza;
  // Every topping used anywhere on the menu, offered as extras
  allIngredients: string[];
  onClose: () => void;
  onAdd: (item: NewCartItem) => void;
}

function Chip({
  label,
  pressed,
  disabled,
  variant,
  onToggle,
}: {
  label: string;
  pressed: boolean;
  disabled?: boolean;
  variant: "remove" | "add";
  onToggle: () => void;
}) {
  const selected =
    variant === "remove"
      ? "border-line text-muted line-through decoration-accent/70"
      : "border-accent bg-accent text-accent-ink";

  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onToggle}
      className={`rounded-full border px-3 py-1.5 text-sm capitalize focus:outline-none focus-visible:ring focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-40 ${pressed ? selected : "border-line text-ink hover:border-ink/40"}`}
    >
      {variant === "add" && !pressed && <span className="mr-1 text-muted">+</span>}
      {label}
    </button>
  );
}

// Lets the customer take toppings off a pizza or add up to three extras.
// The API stores these as addIngredients / removeIngredients on each cart item.
function CustomizePizza({ pizza, allIngredients, onClose, onAdd }: CustomizePizzaProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [removed, setRemoved] = useState<string[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  // The dialog only exists while open, so open it as soon as it mounts
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const extraOptions = allIngredients.filter((ing) => !pizza.ingredients.includes(ing));
  const summary = describeCustomization(extras, removed);
  const unitPrice = priceWithExtras(pizza.unitPrice, extras.length);

  function toggle(list: string[], setList: (next: string[]) => void, ingredient: string) {
    setList(list.includes(ingredient) ? list.filter((i) => i !== ingredient) : [...list, ingredient]);
  }

  function handleAdd() {
    onAdd({
      pizzaId: pizza.id,
      name: pizza.name,
      quantity,
      unitPrice,
      imageUrl: pizza.imageUrl,
      addIngredients: extras,
      removeIngredients: removed,
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Clicking the dimmed backdrop (the dialog element itself) closes it
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      aria-labelledby={`customize-${pizza.id}-title`}
      className="m-auto max-h-[90dvh] w-[min(34rem,calc(100%-2rem))] overflow-y-auto rounded-3xl border border-line bg-surface p-0 text-ink backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <img src={pizza.imageUrl} alt="" width={72} height={72} className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-line sm:h-[4.5rem] sm:w-[4.5rem]" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Make it yours</p>
            {/* Focus lands on the title when the dialog opens, not on the close button */}
            <h2 id={`customize-${pizza.id}-title`} tabIndex={-1} autoFocus className="mt-1 font-display text-3xl leading-tight focus:outline-none">{pizza.name}</h2>
            <p className="mt-1 text-sm text-muted">{formatCurrency(pizza.unitPrice)} · extras {formatCurrency(EXTRA_TOPPING_PRICE)} each</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close"
            className="-mr-2 -mt-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-xl text-muted transition-colors hover:bg-subtle hover:text-ink focus:outline-none focus-visible:ring focus-visible:ring-accent/40"
          >
            &times;
          </button>
        </div>

        <section className="mt-8">
          <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Take off <span className="normal-case tracking-normal">· free</span></h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {pizza.ingredients.map((ingredient) => (
              <Chip
                key={ingredient}
                label={ingredient}
                variant="remove"
                pressed={removed.includes(ingredient)}
                onToggle={() => toggle(removed, setRemoved, ingredient)}
              />
            ))}
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Add extra <span className="normal-case tracking-normal">· {formatCurrency(EXTRA_TOPPING_PRICE)} each</span></h3>
            <span className="text-xs tabular-nums text-muted">{extras.length} of {MAX_EXTRAS}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {extraOptions.map((ingredient) => {
              const isOn = extras.includes(ingredient);
              return (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  variant="add"
                  pressed={isOn}
                  disabled={!isOn && extras.length >= MAX_EXTRAS}
                  onToggle={() => toggle(extras, setExtras, ingredient)}
                />
              );
            })}
          </div>
        </section>

        <p className="mt-7 border-t border-dashed border-line pt-5 text-sm capitalize text-muted" aria-live="polite">
          {summary || "The classic recipe"}
          {extras.length > 0 && (
            <span className="normal-case tabular-nums"> · +{formatCurrency(extras.length * EXTRA_TOPPING_PRICE)}</span>
          )}
        </p>

        <div className="mt-5 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button type="round" ariaLabel="One less" disabled={quantity <= 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>&minus;</Button>
            <span className="min-w-[2ch] text-center font-medium tabular-nums">{quantity}</span>
            <Button type="round" ariaLabel="One more" onClick={() => setQuantity((q) => q + 1)}>+</Button>
          </div>
          <Button type="primary" onClick={handleAdd} className="flex-1 !px-4">
            Add · {formatCurrency(unitPrice * quantity)}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

export default CustomizePizza;
