import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from 'react-redux';
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
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();




