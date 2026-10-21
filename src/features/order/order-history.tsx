import { useLoaderData } from "react-router-dom";
import store, { useAppSelector } from "../../store";
import { getOrder } from "../../services/api-restaurant";
import { formatCurrency } from "../../utils/helpers";
import type { OrderData } from "../../utils/types";
import Button from "../../ui/button";
import { getSavedOrders } from "./order-history-slice";
import { getStage, STAGE_LABELS, type Stage } from "./order-stage";
import { useReorder } from "./use-reorder";
import { useNow } from "../../hooks/use-now";

// How many recent orders get a live status from the API on each visit
const LIVE_LIMIT = 10;

const STAGE_STYLES: Record<Stage, string> = {
  delivered: "bg-success text-success-ink",
  preparing: "border border-accent text-accent",
  "on-the-way": "border border-accent text-accent",
  late: "border border-line text-muted",
};

function formatPlaced(dateStr: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function OrderHistory() {
  const orders = useAppSelector(getSavedOrders);
  const live = useLoaderData() as Record<string, OrderData>;
  const { reorder, pendingId } = useReorder();
  // Re-check "late" vs "on its way" every half minute while the page is open
  const now = useNow(30_000);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-accent">I tuoi ordini</p>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">My orders</h1>
        <p className="max-w-xl text-muted">Orders placed on this device. Track one, or order the same pizzas again in one tap.</p>
      </header>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-3xl">No orders yet</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">When you place an order, it appears here so you can follow it and reorder later.</p>
          <Button type="primary" to="/menu" className="mt-8">Browse the menu</Button>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {orders.map((order) => {
            const liveOrder = live[order.id];
            const stage = liveOrder
              ? getStage(liveOrder.status, new Date(liveOrder.estimatedDelivery).getTime() - now)
              : null;
            const count = order.items.reduce((sum, item) => sum + item.quantity, 0);
            const isPending = pendingId === order.id;

            return (
              <li key={order.id} className="grid gap-5 py-7 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xl font-light tracking-[0.2em]">#{order.id}</p>
                    {stage && (
                      <span className={`rounded-full px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] ${STAGE_STYLES[stage]}`}>
                        {STAGE_LABELS[stage]}
                      </span>
                    )}
                    {order.priority && (
                      <span className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-accent">Priority</span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-muted">
                    {formatPlaced(order.createdAt)} · {count} {count === 1 ? "pizza" : "pizzas"} ·{" "}
                    <span className="tabular-nums text-ink">{formatCurrency(order.total)}</span>
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    {/* Overlapping plates, like a stack of the pizzas in the order */}
                    <div className="flex shrink-0 -space-x-3">
                      {order.items.slice(0, 4).map((item) =>
                        item.imageUrl ? (
                          <img key={item.lineId} src={item.imageUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover ring-2 ring-bg" />
                        ) : null
                      )}
                    </div>
                    <p className="min-w-0 truncate text-sm">
                      {order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 sm:justify-end">
                  <Button type="outline" to={`/order/${order.id}`}>Track</Button>
                  <Button type="small" disabled={pendingId !== null} onClick={() => reorder(order)}>
                    {isPending ? "Adding…" : "Order again"}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Fetch the latest status of recent orders; one failing lookup doesn't break the page
export async function loader() {
  const recent = store.getState().orderHistory.orders.slice(0, LIVE_LIMIT);
  const results = await Promise.allSettled(recent.map((order) => getOrder(order.id)));

  const live: Record<string, OrderData> = {};
  results.forEach((result, i) => {
    if (result.status === "fulfilled") live[recent[i].id] = result.value;
  });
  return live;
}

export default OrderHistory;
