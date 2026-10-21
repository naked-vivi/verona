import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { SavedOrder } from "../../utils/types";
import { loadPersistedState } from "../../utils/persist";

// Orders placed from this browser. The API can look up one order by ID but
// can't list them, so the list itself lives here (and in localStorage).

type OrderHistoryState = {
  orders: SavedOrder[];
};

const initialState: OrderHistoryState = {
  orders: loadPersistedState()?.orders ?? [],
};

const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<SavedOrder>) {
      state.orders = [action.payload, ...state.orders.filter((order) => order.id !== action.payload.id)];
    },
    markPriority(state, action: PayloadAction<string>) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) order.priority = true;
    },
    removeOrder(state, action: PayloadAction<string>) {
      state.orders = state.orders.filter((order) => order.id !== action.payload);
    },
  },
});

export const { addOrder, markPriority, removeOrder } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;

export const getSavedOrders = (state: RootState) => state.orderHistory.orders;
export const getSavedOrder = (id: string) => (state: RootState) =>
  state.orderHistory.orders.find((order) => order.id === id);
