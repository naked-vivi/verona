import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./delete-item";
import type { CartItemData } from "../../utils/types";
import UpdateItemQuantity from "./update-item-quantity";
import { LogoMark } from "../../ui/logo";
import { describeCustomization } from "../../utils/cart-line";

function CartItem({ item }: { item: CartItemData }) {
  const { lineId, name, quantity, unitPrice, totalPrice, imageUrl, addIngredients, removeIngredients } = item;
  const customization = describeCustomization(addIngredients, removeIngredients);

  return (
    <li className="flex items-center gap-4 py-5 sm:gap-6">
      {imageUrl ? (
        <img src={imageUrl} alt="" width={64} height={64} className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-line sm:h-16 sm:w-16" />
      ) : (
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-subtle text-accent sm:h-16 sm:w-16">
          <LogoMark className="h-8 w-8" />
        </span>
      )}

      <div className="flex min-w-0 grow flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate font-display text-xl leading-tight sm:text-2xl">{name}</p>
          {customization && <p className="mt-0.5 text-xs capitalize text-accent">{customization}</p>}
          <p className="mt-0.5 text-xs text-muted tabular-nums">{formatCurrency(unitPrice)} each</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
          <UpdateItemQuantity lineId={lineId} currentQuantity={quantity} />
          <p className="w-20 text-right font-medium tabular-nums">{formatCurrency(totalPrice)}</p>
          <DeleteItem lineId={lineId} />
        </div>
      </div>
    </li>
  );
}

export default CartItem;
