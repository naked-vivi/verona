import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from 'react-redux';
import userReducer from "./features/user/userSlice"
import cartReducer from "./features/cart/cartSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        cart: cartReducer,
    }
});

export default store;

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();




