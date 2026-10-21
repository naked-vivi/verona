import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store";
import { getTotalCartPrice, getTotalCartQuantity } from "./cart-slice";
import { formatCurrency } from "../../utils/helpers";
import { LogoMark } from "../../ui/logo";
import { CART_LANDED_EVENT } from "../../utils/fly-to-cart";
import { useCartBarVisible } from "./use-cart-bar-visible";

function CartOverview() {
  const totalCartQuantity = useAppSelector(getTotalCartQuantity)
  const totalCartPrice = useAppSelector(getTotalCartPrice)
  const barRef = useRef<HTMLAnchorElement>(null);
  const isVisible = useCartBarVisible();

  useEffect(() => {
    if (!isVisible) return;

    function handleLanded() {
      barRef.current?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
        { duration: 380, easing: "cubic-bezier(.3,1.6,.5,1)" }
      );
    }

    window.addEventListener(CART_LANDED_EVENT, handleLanded);
    return () => window.removeEventListener(CART_LANDED_EVENT, handleLanded);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="cart-bar pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <Link
        ref={barRef}
        to="/cart"
        viewTransition
        aria-label={`View cart: ${totalCartQuantity} ${totalCartQuantity === 1 ? "pizza" : "pizzas"}, ${formatCurrency(totalCartPrice)}`}
        className="animate-rise-in pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-full bg-bar py-2 pl-2 pr-5 text-bar-ink focus:outline-none focus-visible:ring focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <span data-cart-target className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bar-ink/10">
          <LogoMark className="h-6 w-6" />
        </span>
        <span className="flex-1 text-sm">
          <span className="font-medium">
            {totalCartQuantity} {totalCartQuantity === 1 ? "pizza" : "pizzas"}
          </span>
          <span className="tabular-nums opacity-70"> · {formatCurrency(totalCartPrice)}</span>
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.2em]">View cart &rarr;</span>
      </Link>
    </div>
  );
}

export default CartOverview;
