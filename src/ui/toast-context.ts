import { createContext, useContext } from "react";

export type ToastOptions = {
  message: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
};

export type ShowToast = (options: ToastOptions) => void;

export const ToastContext = createContext<ShowToast>(() => {
  // * No-op outside the provider
});

export function useToast() {
  return useContext(ToastContext);
}
