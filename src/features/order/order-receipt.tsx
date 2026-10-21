import { formatCurrency } from "../../utils/helpers";
import type { OrderData, Pizza, SavedOrder } from "../../utils/types";
import { LogoMark } from "../../ui/logo";
import UpdateOrder from "./update-order";
import { describeCustomization } from "../../utils/cart-line";

// * Scalloped paper edge: page-colored half circles along the receipt's edge
const scallop = "h-2.5 w-full bg-[radial-gradient(circle_at_8px_0,rgb(var(--color-bg))_6px,transparent_6.5px)] [background-size:16px_10px] bg-repeat-x";

interface OrderReceiptProps {
  order: OrderData;
  savedOrder?: SavedOrder;
  menu?: Pizza[];
  isLoadingMenu: boolean;
}

function formatPlacedAt(dateStr: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(dateStr));
}

function DeliveryDetails({ order, savedOrder }: { order: OrderData; savedOrder?: SavedOrder }) {
  const customer = savedOrder?.customer || order.customer;
  const [lat, lng] = (savedOrder?.position ?? "").split(",");
  const mapUrl = lat && lng ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}` : null;

  return (
    <section aria-labelledby="deliver-to">
      <h3 id="deliver-to" className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted">Deliver to</h3>

      <dl className="mt-3 space-y-2 text-sm">
        {customer && (
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">Name</dt>
            <dd className="min-w-0 font-medium">{customer}</dd>
          </div>
        )}
        {savedOrder?.address && (
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">Address</dt>
            <dd className="min-w-0">
              {savedOrder.address}
              {mapUrl && (
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] text-accent hover:underline"
                >
                  View on map &rarr;
                </a>
              )}
            </dd>
          </div>
        )}
        {savedOrder?.phone && (
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">Phone</dt>
            <dd className="min-w-0 tabular-nums">{savedOrder.phone}</dd>
          </div>
        )}
        {savedOrder?.createdAt && (
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 text-muted">Placed</dt>
            <dd className="min-w-0">{formatPlacedAt(savedOrder.createdAt)}</dd>
          </div>
        )}
        <div className="flex gap-3">
          <dt className="w-16 shrink-0 text-muted">Payment</dt>
          <dd className="min-w-0">Cash on delivery</dd>
        </div>
      </dl>

      {!savedOrder && (
        <p className="mt-3 text-xs text-muted">
          For privacy, the address and phone number only show on the device that placed this order.
        </p>
      )}
    </section>
  );
}

function OrderReceipt({ order, savedOrder, menu, isLoadingMenu }: OrderReceiptProps) {
  const { id, cart, orderPrice, priority, priorityPrice } = order;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="lg:sticky lg:top-24" aria-label="Receipt">
      <div className="bg-surface">
        <div className={scallop} aria-hidden="true" />

        <div className="px-7 pb-8 pt-6">
          <div className="flex flex-col items-center text-center">
            <LogoMark className="h-9 w-9 text-accent" />
            <p className="mt-3 font-display text-2xl uppercase tracking-[0.3em]">Verona</p>
            <p className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted">Pizzeria · dal forno a te</p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted">
              Ordine <span className="text-ink">#{id}</span>
            </p>
          </div>

          <div className="my-6 border-t border-dashed border-line" />

          <DeliveryDetails order={order} savedOrder={savedOrder} />

          <div className="my-6 border-t border-dashed border-line" />

          <ul className="space-y-5">
            {cart.map((item) => {
              const pizza = menu?.find((p) => p.id === item.pizzaId);
              const customization = describeCustomization(item.addIngredients, item.removeIngredients);
              return (
                <li key={`${item.pizzaId}-${customization}`} className="flex gap-3">
                  {pizza ? (
                    <img src={pizza.imageUrl} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-line" />
                  ) : (
                    <span className={`h-10 w-10 shrink-0 rounded-full ${isLoadingMenu ? "skeleton" : "bg-subtle"}`} />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="truncate font-display text-lg leading-tight">{item.name}</p>
                      <span aria-hidden="true" className="min-w-3 flex-1 -translate-y-1 border-b border-dotted border-muted/40" />
                      <p className="shrink-0 text-sm tabular-nums">{formatCurrency(item.totalPrice)}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {item.quantity} &times; {formatCurrency(item.unitPrice)}
                      {pizza && <span className="capitalize italic"> · {pizza.ingredients.join(", ")}</span>}
                    </p>
                    {customization && <p className="mt-0.5 text-xs capitalize text-accent">{customization}</p>}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="my-6 border-t border-dashed border-line" />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">{itemCount} {itemCount === 1 ? "pizza" : "pizzas"}</dt>
              <dd className="tabular-nums">{formatCurrency(orderPrice)}</dd>
            </div>
            {priority && (
              <div className="flex justify-between">
                <dt className="text-muted">Priority delivery</dt>
                <dd className="tabular-nums">{formatCurrency(priorityPrice)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd>Free</dd>
            </div>
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">To pay on delivery</span>
            <span className="font-display text-4xl tabular-nums">{formatCurrency(orderPrice + priorityPrice)}</span>
          </div>

          {!priority && <UpdateOrder orderPrice={orderPrice} />}

          <p className="mt-8 text-center font-display text-xl text-accent">Grazie!</p>
        </div>

        <div className={`${scallop} rotate-180`} aria-hidden="true" />
      </div>
    </aside>
  );
}

export default OrderReceipt;
