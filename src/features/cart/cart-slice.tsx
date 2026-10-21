import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../store";
import type { CartItemData, CartState } from "../../utils/types";
import { loadPersistedState } from "../../utils/persist";
import { makeLineId } from "../../utils/cart-line";

const initialState: CartState = {
    cart: loadPersistedState()?.cart ?? []
}

export type NewCartItem = Omit<CartItemData, "lineId" | "totalPrice">;

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<NewCartItem>) {
            const item = action.payload;
            const lineId = makeLineId(item.pizzaId, item.addIngredients, item.removeIngredients);
            const existing = state.cart.find((line) => line.lineId === lineId);

            if (existing) {
                existing.quantity += item.quantity;
                existing.totalPrice = existing.quantity * existing.unitPrice;
                return;
            }

            state.cart.push({ ...item, lineId, totalPrice: item.quantity * item.unitPrice });
        },
        deleteItem(state, action: PayloadAction<string>) {
            state.cart = state.cart.filter((item) => item.lineId !== action.payload)
        },
        increaseItemQuantity(state, action: PayloadAction<string>) {
            const item = state.cart.find((item) => item.lineId === action.payload)

            if (item) {
                item.quantity++;
                item.totalPrice = item.quantity * item.unitPrice;
            }
        },
        decreaseItemQuantity(state, action: PayloadAction<string>) {
            const item = state.cart.find((item) => item.lineId === action.payload)

            if (item) {
                item.quantity--;
                item.totalPrice = item.quantity * item.unitPrice;
            }

            if (item?.quantity === 0) cartSlice.caseReducers.deleteItem(state, action);
        },
        clearCart(state) {
            state.cart = [];
        },
        restoreItem(state, action: PayloadAction<{ item: CartItemData; index: number }>) {
            const { item, index } = action.payload;
            if (state.cart.some((line) => line.lineId === item.lineId)) return;
            state.cart.splice(Math.min(index, state.cart.length), 0, item);
        },
        restoreCart(state, action: PayloadAction<CartItemData[]>) {
            state.cart = action.payload;
        },
    }
})

export const {
    addItem,
    deleteItem,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
    restoreItem,
    restoreCart,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state: RootState) => state.cart.cart;

export const getTotalCartQuantity = (state: RootState) =>
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state: RootState) =>
    state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);

export const getCurrentQuantityById = (id: number) => (state: RootState) =>
    state.cart.cart.reduce((sum, item) => (item.pizzaId === id ? sum + item.quantity : sum), 0);

export const getLineQuantity = (lineId: string) => (state: RootState) =>
    state.cart.cart.find((item) => item.lineId === lineId)?.quantity ?? 0;
