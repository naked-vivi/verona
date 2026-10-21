import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from 'react-redux';
import userReducer from "./features/user/user-slice"
import cartReducer from "./features/cart/cart-slice"
import orderHistoryReducer from "./features/order/order-history-slice"
import { savePersistedState } from "./utils/persist";

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
        orderHistory: orderHistoryReducer,
    }
});

let last = {
    username: store.getState().user.username,
    cart: store.getState().cart.cart,
    orders: store.getState().orderHistory.orders,
};

store.subscribe(() => {
    const state = store.getState();
    const next = {
        username: state.user.username,
        cart: state.cart.cart,
        orders: state.orderHistory.orders,
    };
    if (next.username === last.username && next.cart === last.cart && next.orders === last.orders) return;

    last = next;
    savePersistedState(next);
});

export default store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();
