import { Form, redirect, useActionData, useNavigation, type ActionFunctionArgs } from "react-router-dom";
import { createOrder } from "../../services/api-restaurant";
import Button from "../../ui/button";
import LinkButton from "../../ui/link-button";
import store, { useAppDispatch, useAppSelector } from "../../store";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cart-slice";
import EmptyCart from "../cart/empty-cart";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { addOrder } from "./order-history-slice";
import { describeCustomization } from "../../utils/cart-line";
import type { CartItemData } from "../../utils/types";

import { fetchAddress } from "../user/user-slice";
import useTitle from "../../hooks/use-title";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const PRIORITY_RATE = 0.2;

const fieldRow = "grid gap-2 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start";
const labelStyle = "pt-0 text-xs font-medium uppercase tracking-[0.2em] text-muted sm:pt-3.5";
const errorStyle = "mt-2 rounded-lg bg-danger-soft px-3 py-2 text-xs text-danger";

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  useTitle("Checkout");
  const { username, status: addressStatus, position, address, error: errorAddress } = useAppSelector((state) => state.user)
  const isLoadingAddress = addressStatus === "loading";

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"
  const formErrors = useActionData() as { phone?: string } | undefined;
  const dispatch = useAppDispatch();

  const cart = useAppSelector(getCart)

  const totalCartPrice = useAppSelector(getTotalCartPrice)
  const priorityPrice = withPriority ? totalCartPrice * PRIORITY_RATE : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const hasPosition =
    position.latitude !== undefined && position.longitude !== undefined;

  if (!cart.length) return <EmptyCart />

  // Send only the fields the API expects (the photo and line ID are just for our UI)
  const cartForApi = cart.map(({ pizzaId, name, quantity, unitPrice, totalPrice, addIngredients, removeIngredients }) => ({
    pizzaId, name, quantity, unitPrice, totalPrice, addIngredients, removeIngredients,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <LinkButton to="/cart">&larr; Back to cart</LinkButton>

      <header className="mt-6 flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-accent">Checkout</p>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">Ready to order? Let's go!</h1>
      </header>

      <Form method="POST" viewTransition className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className={fieldRow}>
            <label htmlFor="customer" className={labelStyle}>First name</label>
            <input id="customer" className="input w-full" type="text" name="customer" autoComplete="given-name" defaultValue={username} required />
          </div>

          <div className={fieldRow}>
            <label htmlFor="phone" className={labelStyle}>Phone number</label>
            <div>
              <input
                id="phone"
                className="input w-full"
                type="tel"
                name="phone"
                autoComplete="tel"
                aria-invalid={Boolean(formErrors?.phone)}
                aria-describedby={formErrors?.phone ? "phone-error" : "phone-hint"}
                required
              />
              {formErrors?.phone
                ? <p id="phone-error" className={errorStyle}>{formErrors.phone}</p>
                : <p id="phone-hint" className="mt-2 text-xs text-muted">The rider calls this number if they can't find you.</p>}
            </div>
          </div>

          <div className={fieldRow}>
            <label htmlFor="address" className={labelStyle}>Address</label>
            <div>
              <div className="relative">
                <input
                  id="address"
                  className={`input w-full ${!hasPosition ? "pr-40 md:pr-44" : ""}`}
                  type="text"
                  name="address"
                  autoComplete="street-address"
                  disabled={isLoadingAddress}
                  defaultValue={address}
                  required />
                {!hasPosition &&
                  (<span className="absolute right-1 top-1/2 z-10 -translate-y-1/2">
                    <Button
                      disabled={isLoadingAddress}
                      type="small"
                      onClick={() => dispatch(fetchAddress())}>
                      {isLoadingAddress ? "Locating…" : "Use my location"}
                    </Button>
                  </span>)}
              </div>
              {addressStatus === 'error' &&
                <p className={errorStyle}>{errorAddress}</p>}
            </div>
          </div>

          {/* Priority as a selectable card */}
          <label
            htmlFor="priority"
            className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-colors duration-200 ${withPriority ? "border-accent bg-accent/5" : "border-line hover:border-ink/30"}`}
          >
            <input
              type="checkbox"
              name="priority"
              id="priority"
              className="mt-1 h-5 w-5 shrink-0 accent-accent focus:outline-none focus-visible:ring focus-visible:ring-accent/40"
              checked={withPriority}
              onChange={(e) => setWithPriority(e.target.checked)}
            />
            <span className="flex grow flex-col gap-1">
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-xl">Priority delivery</span>
                <span className="text-sm tabular-nums text-muted">+{formatCurrency(totalCartPrice * PRIORITY_RATE)}</span>
              </span>
              <span className="text-sm text-muted">Your order goes to the front of the oven queue. Adds 20% to the total.</span>
            </span>
          </label>
        </div>

        {/* Order summary */}
        <aside className="rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl">Your order</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {cart.map((item) => {
              const customization = describeCustomization(item.addIngredients, item.removeIngredients);
              return (
                <li key={item.lineId} className="flex justify-between gap-4">
                  <span className="min-w-0">
                    <span className="block truncate"><span className="text-muted">{item.quantity}&times;</span> {item.name}</span>
                    {customization && <span className="block truncate text-xs capitalize text-accent">{customization}</span>}
                  </span>
                  <span className="shrink-0 tabular-nums">{formatCurrency(item.totalPrice)}</span>
                </li>
              );
            })}
          </ul>

          <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatCurrency(totalCartPrice)}</dd>
            </div>
            {withPriority && (
              <div className="flex justify-between">
                <dt className="text-muted">Priority</dt>
                <dd className="tabular-nums">{formatCurrency(priorityPrice)}</dd>
              </div>
            )}
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">To pay on delivery</span>
            <span className="font-display text-3xl tabular-nums">{formatCurrency(totalPrice)}</span>
          </div>

          <input type="hidden" name="cart" value={JSON.stringify(cartForApi)} />
          <input
            type="hidden"
            name="position"
            value={position.latitude && position.longitude ? `${position.latitude},${position.longitude}` : ""}
          />
          <Button type="primary" disabled={isSubmitting || isLoadingAddress} className="mt-6 w-full">
            {isSubmitting ? "Placing order…" : `Order now · ${formatCurrency(totalPrice)}`}
          </Button>
        </aside>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    phone: data.phone as string,
    cart: JSON.parse(data.cart as string),
    priority: data.priority === "on"
  };

  const errors: { phone?: string } = {};
  if (!isValidPhone(order.phone))
    errors.phone = "Please enter a valid phone number, for example +39 045 123 4567."

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

  // Actions run outside React, so this is one of the few places we use the store directly.
  // Save the order to "My orders" (with photos for reordering), then empty the cart.
  const cartLines: CartItemData[] = store.getState().cart.cart;
  store.dispatch(addOrder({
    id: newOrder.id,
    // The API returns when it received the order (looking it up later doesn't)
    createdAt: newOrder.createdAt ?? new Date().toISOString(),
    estimatedDelivery: newOrder.estimatedDelivery,
    priority: order.priority,
    customer: newOrder.customer ?? String(data.customer ?? ""),
    phone: newOrder.phone ?? order.phone,
    address: newOrder.address ?? String(data.address ?? ""),
    position: newOrder.position || undefined,
    total: (newOrder.orderPrice ?? 0) + (newOrder.priorityPrice ?? 0),
    items: cartLines.map(({ lineId, pizzaId, name, quantity, unitPrice, addIngredients, removeIngredients, imageUrl }) => ({
      lineId, pizzaId, name, quantity, unitPrice, addIngredients, removeIngredients, imageUrl,
    })),
  }));
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`)
}

export default CreateOrder;
