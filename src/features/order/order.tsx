// Test ID: IIDSAT

import { useFetcher, useLoaderData, useRevalidator, type LoaderFunctionArgs } from "react-router-dom";
import { getOrder } from "../../services/api-restaurant";
import type { OrderData, Pizza } from "../../utils/types";
import { useEffect } from "react";
import OrderStatus from "./order-status";
import OrderReceipt from "./order-receipt";
import LinkButton from "../../ui/link-button";
import { useAppSelector } from "../../store";
import { getSavedOrder } from "./order-history-slice";
import { getStage, isFinished } from "./order-stage";
import { useNow } from "../../hooks/use-now";

const REFRESH_MS = 30_000;

function Order() {
  // Anyone can look up any order, so the API leaves out the customer's name and address
  const order: OrderData = useLoaderData();
  const fetcher = useFetcher<Pizza[]>();
  const revalidator = useRevalidator();
  // Orders placed on this device also have the time they were placed
  const savedOrder = useAppSelector(getSavedOrder(order.id));

  const estimatedAt = new Date(order.estimatedDelivery).getTime();
  const isDoneOnLoad = order.status === "delivered";
  // Tick every second for the countdown, until the order is delivered
  const now = useNow(isDoneOnLoad ? null : 1000);
  const stage = getStage(order.status, estimatedAt - now);
  const isLive = !isFinished(stage);

  // Load the menu in the background for each pizza's photo and ingredients
  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle")
      fetcher.load("/menu")
  }, [fetcher])

  // Ask the API for the latest status every 30 seconds while the order is on its way
  // (and only while the tab is visible)
  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible" && revalidator.state === "idle") revalidator.revalidate();
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [isLive, revalidator]);

  return (
    <div className="mx-auto max-w-5xl">
      {savedOrder && <LinkButton to="/orders">&larr; My orders</LinkButton>}

      <div className={`grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 ${savedOrder ? "mt-6" : ""}`}>
        <OrderStatus
          order={order}
          now={now}
          placedAt={savedOrder?.createdAt}
        />
        <OrderReceipt order={order} savedOrder={savedOrder} menu={fetcher.data} isLoadingMenu={fetcher.state === "loading"} />
      </div>
    </div>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.orderId) {
    throw new Error("Order ID is missing");
  }

  const order = await getOrder(params.orderId)
  return order;
}

export default Order;
