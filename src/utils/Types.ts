export type Pizza = {
    id: number;
    name: string;
    unitPrice: number;
    ingredients: string[];
    soldOut: boolean;
    imageUrl: string;
};

export interface CartItemData {
    pizzaId: number; // or string, depending on your API
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface CartState {
    cart: CartItemData[];
}

export type OrderData = {
    id: string;
    status?: string;
    customer: string;
    phone: string;
    address: string;
    priority: boolean;
    estimatedDelivery: string;
    cart: {
        pizzaId: number;
        name: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
    position: string;
    orderPrice: number;
    priorityPrice: number;
};