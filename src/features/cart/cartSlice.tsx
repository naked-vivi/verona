import { createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../store"; // 👈 Notice the two sets of dots
import type { CartState } from "../../utils/Types";

const initialState: CartState = {
    cart: []
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action) {
            //payload=new item
            state.cart.push(action.payload)
        },
        deleteItem(state, action) {
            //payload=id
            state.cart = state.cart.filter((item) => item.pizzaId !== action.payload)
        },
        increaseItemQuantity(state, action) {
            const item = state.cart.find((item) => item.pizzaId === action.payload)

            if (item) {
                item.quantity++;
                item.totalPrice = item.quantity * item.unitPrice;
            }
        },
        decreaseItemQuantity(state, action) {
            const item = state.cart.find((item) => item.pizzaId === action.payload)

            if (item) {
                item.quantity--;
                item.totalPrice = item.quantity * item.unitPrice;
            }
        },
        clearCart(state) {
            state.cart = [];
        }
    }
})

export const { addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state: RootState) => state.cart.cart;

export const getTotalCartQuantity = (state: RootState) =>
    state.cart.cart.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
    );

export const getTotalCartPrice = (state: RootState) =>
    state.cart.cart.reduce(
        (sum: number, item: { totalPrice: number }) => sum + item.totalPrice,
        0
    );

export const getCurrentQuantityById = (id: number) => (state: RootState) =>
    state.cart.cart.find(item => item.pizzaId === id)?.quantity ?? 0;

