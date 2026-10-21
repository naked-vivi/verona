import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../store";
import { getTotalCartQuantity } from "./cart-slice";

// Pages where a "view cart" bar would only repeat what's already on screen
const HIDDEN_ON = ["/cart", "/order/new"];

export function useCartBarVisible() {
  const quantity = useAppSelector(getTotalCartQuantity);
  const { pathname } = useLocation();
  return quantity > 0 && !HIDDEN_ON.includes(pathname);
}
