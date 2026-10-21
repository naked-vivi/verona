export type Pizza = {
    id: number;
    name: string;
    unitPrice: number;
    ingredients: string[];
    soldOut: boolean;
    imageUrl: string;
};

export interface CartItemData {
    // One cart line per pizza + customization, e.g. "1|olives|basil".
    // The same pizza with different toppings becomes a separate line.
    lineId: string;
    pizzaId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    addIngredients: string[];
    removeIngredients: string[];
    imageUrl?: string; // only used for thumbnails, never sent to the API
}

export interface CartState {
    cart: CartItemData[];
}

export type OrderCartItem = {
    pizzaId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    addIngredients?: string[];
    removeIngredients?: string[];
};

export type OrderData = {
    id: string;
    status?: string;
    customer: string;
    phone: string;
    address: string;
    priority: boolean;
    estimatedDelivery: string;
    cart: OrderCartItem[];
    position: string;
    orderPrice: number;
    priorityPrice: number;
};

// An order placed from this browser, kept in "My orders"
export type SavedOrder = {
    id: string;
    createdAt: string;
    estimatedDelivery: string;
    priority: boolean;
    total: number;
    items: Omit<CartItemData, "totalPrice">[];
    // Delivery details. The API only returns these when the order is placed
    // (looking an order up by ID leaves them out), so they're kept here.
    customer?: string;
    phone?: string;
    address?: string;
    position?: string; // "latitude,longitude" when the customer shared their location
};
