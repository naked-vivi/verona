import { createContext, useContext } from "react";

export type ToastOptions = {
  message: string;
  // Optional button inside the toast, e.g. "Undo"
  action?: { label: string; onClick: () => void };
  duration?: number;
};

export type ShowToast = (options: ToastOptions) => void;

export const ToastContext = createContext<ShowToast>(() => {
  // Outside the provider (e.g. a root-level error page) toasts are simply skipped
});

export function useToast() {
  return useContext(ToastContext);
}
