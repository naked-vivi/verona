export type Pizza = {
    id: number;
    name: string;
    unitPrice: number;
    ingredients: string[];
    soldOut: boolean;
    imageUrl: string;
};

export interface CartItemData {
    // * One line per pizza + toppings, e.g. "1|olives|basil"
    lineId: string;
    pizzaId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    addIngredients: string[];
    removeIngredients: string[];
    imageUrl?: string;
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

export type SavedOrder = {
    id: string;
    createdAt: string;
    estimatedDelivery: string;
    priority: boolean;
    total: number;
    items: Omit<CartItemData, "totalPrice">[];
    // * Only returned when the order is created, so they're saved here
    customer?: string;
    phone?: string;
    address?: string;
    position?: string;
};
