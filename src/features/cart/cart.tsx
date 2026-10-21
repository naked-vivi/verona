import LinkButton from '../../ui/link-button';
import Button from '../../ui/button';
import { useAppSelector } from '../../store';
import { getCart, getTotalCartPrice, getTotalCartQuantity } from './cart-slice';
import { useCartActions } from './use-cart-actions';
import EmptyCart from './empty-cart';
import CartItem from './cart-item';
import { formatCurrency } from '../../utils/helpers';
import useTitle from '../../hooks/use-title';

function Cart() {
  const username = useAppSelector((state) => state.user.username);
  const cart = useAppSelector(getCart);
  const totalQuantity = useAppSelector(getTotalCartQuantity);
  const totalPrice = useAppSelector(getTotalCartPrice);
  const { clear } = useCartActions();
  useTitle('My cart');

  if (!cart.length) return <EmptyCart />

  return (
    <div className="mx-auto max-w-5xl">
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <header className="mt-6 flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-accent">Il carrello</p>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">
          {username ? `Your cart, ${username}` : "Your cart"}
        </h1>
      </header>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ul className="divide-y divide-line border-y border-line">
          {cart.map((item) => (
            <CartItem item={item} key={item.lineId} />
          ))}
        </ul>

        <aside className="rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl">Summary</h2>
            <Button type="ghost" onClick={clear} className="-mr-1">Clear cart</Button>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">{totalQuantity} {totalQuantity === 1 ? "pizza" : "pizzas"}</dt>
              <dd className="tabular-nums">{formatCurrency(totalPrice)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd>Free</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-5">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Total</span>
              <span className="text-xs text-muted">Pay on delivery</span>
            </div>
            <span className="font-display text-4xl leading-none tabular-nums">{formatCurrency(totalPrice)}</span>
          </div>

          <Button type="primary" to="/order/new" className="mt-6 w-full">Order pizza</Button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
