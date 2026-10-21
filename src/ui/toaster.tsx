import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContext, type ToastOptions } from "./toast-context";
import { useCartBarVisible } from "../features/cart/use-cart-bar-visible";

type Toast = ToastOptions & { id: number };

const DEFAULT_DURATION = 5000;
const MAX_TOASTS = 3;

function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const cartBarVisible = useCartBarVisible();

  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((list) => [...list, { ...options, id }].slice(-MAX_TOASTS));
      timers.current.set(id, setTimeout(() => dismiss(id), options.duration ?? DEFAULT_DURATION));
    },
    [dismiss]
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 z-50 flex flex-col items-center gap-2 px-4 transition-[bottom] duration-300 ${cartBarVisible
          ? "bottom-[calc(5.25rem+env(safe-area-inset-bottom))]"
          : "bottom-[calc(1rem+env(safe-area-inset-bottom))]"
          }`}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-rise-in pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-full border border-line bg-surface py-2 pl-5 pr-2 text-sm text-ink"
          >
            <p className="min-w-0 flex-1 truncate">{toast.message}</p>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  dismiss(toast.id);
                }}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent transition-colors hover:bg-subtle focus:outline-none focus-visible:ring focus-visible:ring-accent/40"
              >
                {toast.action.label}
              </button>
            )}
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-ink focus:outline-none focus-visible:ring focus-visible:ring-accent/40"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default Toaster;
