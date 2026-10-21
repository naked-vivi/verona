import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { useToast } from "../../ui/toast-context";
import { getMenu } from "../../services/api-restaurant";
import { addItem } from "../cart/cart-slice";
import type { Pizza, SavedOrder } from "../../utils/types";
import { priceWithExtras } from "../../utils/cart-line";

// * Uses today's prices and skips pizzas that are sold out
export function useReorder() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function reorder(order: SavedOrder) {
    setPendingId(order.id);
    try {
      const menu: Pizza[] = await getMenu();
      let added = 0;
      const soldOut: string[] = [];

      for (const item of order.items) {
        const pizza = menu.find((p) => p.id === item.pizzaId);
        if (!pizza || pizza.soldOut) {
          soldOut.push(item.name);
          continue;
        }
        dispatch(
          addItem({
            pizzaId: item.pizzaId,
            name: pizza.name,
            quantity: item.quantity,
            unitPrice: priceWithExtras(pizza.unitPrice, item.addIngredients.length),
            imageUrl: pizza.imageUrl,
            addIngredients: item.addIngredients,
            removeIngredients: item.removeIngredients,
          })
        );
        added += item.quantity;
      }

      if (added === 0) {
        toast({ message: "Everything in that order is sold out today." });
        return;
      }

      const note = soldOut.length ? ` · ${soldOut.join(", ")} sold out` : "";
      toast({ message: `${added} ${added === 1 ? "pizza" : "pizzas"} from #${order.id} added${note}` });
      navigate("/cart", { viewTransition: true });
    } catch {
      toast({ message: "Couldn't load today's menu. Please try again." });
    } finally {
      setPendingId(null);
    }
  }

  return { reorder, pendingId };
}
