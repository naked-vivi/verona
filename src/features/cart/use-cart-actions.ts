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

  function removePizza(pizzaId: number) {
    const removed = cart
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.pizzaId === pizzaId);
    if (!removed.length) return;

    removed.forEach(({ item }) => dispatch(deleteItem(item.lineId)));
    const count = removed.reduce((sum, { item }) => sum + item.quantity, 0);
    toast({
      message: `${count > 1 ? `${count} × ` : ""}${removed[0].item.name} removed`,
      action: { label: "Undo", onClick: () => removed.forEach((entry) => dispatch(restoreItem(entry))) },
    });
  }

  function increase(lineId: string) {
    dispatch(increaseItemQuantity(lineId));
  }

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
