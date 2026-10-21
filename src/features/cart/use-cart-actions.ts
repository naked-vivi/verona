import { useAppDispatch, useAppSelector } from "../../store";
import { useToast } from "../../ui/toast-context";
import {
  clearCart,
  decreaseItemQuantity,
  deleteItem,
  getCart,
  increaseItemQuantity,
  restoreCart,
  restoreItem,
} from "./cart-slice";

// Cart changes that can be undone. Removing a line or clearing the cart shows
// a toast with an "Undo" button that puts things back exactly as they were.
export function useCartActions() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(getCart);
  const toast = useToast();

  function removeLine(lineId: string) {
    const index = cart.findIndex((line) => line.lineId === lineId);
    const item = cart[index];
    if (!item) return;

    dispatch(deleteItem(lineId));
    toast({
      message: `${item.name} removed`,
      action: { label: "Undo", onClick: () => dispatch(restoreItem({ item, index })) },
    });
  }

  // Removes every version of one pizza (plain and customized) in one go
  function removePizza(pizzaId: number) {
    const removed = cart
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.pizzaId === pizzaId);
    if (!removed.length) return;

    removed.forEach(({ item }) => dispatch(deleteItem(item.lineId)));
    const count = removed.reduce((sum, { item }) => sum + item.quantity, 0);
    toast({
      message: `${count > 1 ? `${count} × ` : ""}${removed[0].item.name} removed`,
      // Put them back in their original order (lowest position first)
      action: { label: "Undo", onClick: () => removed.forEach((entry) => dispatch(restoreItem(entry))) },
    });
  }

  function increase(lineId: string) {
    dispatch(increaseItemQuantity(lineId));
  }

  // Going below one removes the line, so that path gets the undo toast too
  function decrease(lineId: string) {
    const item = cart.find((line) => line.lineId === lineId);
    if (!item) return;
    if (item.quantity <= 1) removeLine(lineId);
    else dispatch(decreaseItemQuantity(lineId));
  }

  function clear() {
    const snapshot = cart;
    const count = snapshot.reduce((sum, line) => sum + line.quantity, 0);
    dispatch(clearCart());
    toast({
      message: `Cart cleared · ${count} ${count === 1 ? "pizza" : "pizzas"}`,
      action: { label: "Undo", onClick: () => dispatch(restoreCart(snapshot)) },
    });
  }

  return { removeLine, removePizza, increase, decrease, clear };
}
