import { useState } from "react";
import Lottie from "../../ui/lottie";
import type { OrderData } from "../../utils/types";
import { formatCountdown, formatTime, getStage, isFinished, STAGE_LABELS } from "./order-stage";
import deliveryAnimation from "../../assets/delivery.lottie?url";
import arrivedAnimation from "../../assets/arrived.lottie?url";

function formatDay(dateStr: string) {
  return new Intl.DateTimeFormat("en", { weekday: "long", day: "numeric", month: "long" }).format(new Date(dateStr));
}

function OrderIdCard({ id, note }: { id: string; note: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // * Clipboard access can be blocked
    }
  }

  return (
    <div className="mt-10 border-t border-line pt-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted">Order ID</p>
          <p className="mt-2 select-all text-3xl font-light leading-none tracking-[0.25em]">{id}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Order ID copied" : "Copy order ID"}
          title={copied ? "Copied" : "Copy order ID"}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-200 focus:outline-none focus-visible:ring focus-visible:ring-accent/40 ${copied ? "border-accent text-accent" : "border-line text-muted hover:border-ink/40 hover:text-ink"}`}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
              <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
            </svg>
          )}
        </button>
      </div>
      <p className="mt-4 text-sm text-muted">
        {note} Type this ID in the search bar to check back anytime.
      </p>
      <span className="sr-only" aria-live="polite">{copied ? "Order ID copied to clipboard" : ""}</span>
    </div>
  );
}

const STEPS = ["Order placed", "On its way", "Delivered"];

interface OrderStatusProps {
  order: OrderData;
  now: number;
  placedAt?: string;
}

function OrderStatus({ order, now, placedAt }: OrderStatusProps) {
  const estimatedAt = new Date(order.estimatedDelivery).getTime();
  const msLeft = estimatedAt - now;
  const stage = getStage(order.status, msLeft);
  const isDone = isFinished(stage);

  // * Fill by elapsed time when the placed time is known, otherwise up to "On its way"
  let progress = 0.5;
  if (isDone) progress = 1;
  else if (placedAt) {
    const start = new Date(placedAt).getTime();
    progress = Math.min(0.97, Math.max(0.03, (now - start) / (estimatedAt - start)));
  }
  const reached = (step: number) => progress >= step / (STEPS.length - 1);

  return (
    <section className="flex flex-col">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-accent">Il tuo ordine</p>
        {order.priority && (
          <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent-ink">
            Priority
          </span>
        )}
      </div>

      <div className="mt-8 h-40 w-40 overflow-hidden rounded-full bg-white ring-1 ring-line sm:h-44 sm:w-44">
        <Lottie
          src={isDone ? arrivedAnimation : deliveryAnimation}
          loop={!isDone}
          className="h-full w-full scale-110"
        />
      </div>

      <h1 className="mt-4 font-display text-6xl leading-[0.95] md:text-7xl">{STAGE_LABELS[stage]}</h1>

      {isDone ? (
        <p className="mt-5 max-w-md text-lg text-muted">
          {stage === "delivered"
            ? "Buon appetito! We hope every slice was worth the wait."
            : `It was due at ${formatTime(order.estimatedDelivery)}. If it hasn't reached you, give us a call.`}
        </p>
      ) : (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Arriving in</p>
          <p className="mt-1 font-display text-5xl tabular-nums" aria-live="off">
            {formatCountdown(msLeft)}
          </p>
          <p className="mt-2 text-muted">Around {formatTime(order.estimatedDelivery)}</p>
        </div>
      )}

      <div className="mt-10 max-w-md" role="progressbar" aria-label="Order progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
        <div className="relative h-4">
          <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-line" aria-hidden="true" />
          <span
            className="absolute left-2 top-1/2 h-px -translate-y-1/2 bg-accent transition-[width] duration-1000 ease-linear"
            style={{ width: `calc((100% - 1rem) * ${progress})` }}
            aria-hidden="true"
          />
          <div className="relative flex h-full items-center justify-between">
            {STEPS.map((label, i) => (
              <span
                key={label}
                className={`h-4 w-4 rounded-full border transition-colors duration-500 ${reached(i) ? "border-accent bg-accent" : "border-line bg-bg"}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
        <ol className="mt-3 grid grid-cols-3 text-[0.65rem] font-medium uppercase tracking-[0.2em]">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`${i === 1 ? "text-center" : i === 2 ? "text-right" : ""} ${reached(i) ? "text-ink" : "text-muted"}`}
            >
              {label}
            </li>
          ))}
        </ol>
      </div>

      <OrderIdCard
        id={order.id}
        note={`${isDone ? "Delivered on" : "Expected on"} ${formatDay(order.estimatedDelivery)}.`}
      />
    </section>
  );
}

export default OrderStatus;
