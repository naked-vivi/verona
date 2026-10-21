import { useFetcher, type ActionFunctionArgs } from "react-router-dom"
import Button from "../../ui/button"
import { updateOrder } from "../../services/api-restaurant";
import { formatCurrency } from "../../utils/helpers";
import store from "../../store";
import { markPriority } from "./order-history-slice";

const PRIORITY_RATE = 0.2;

function UpdateOrder({ orderPrice }: { orderPrice: number }) {
    const fetcher = useFetcher();
    const isUpdating = fetcher.state !== "idle";

    return (
        <fetcher.Form method="PATCH" className="mt-6 rounded-xl border border-dashed border-accent/40 p-4">
            <p className="font-display text-xl">In a hurry?</p>
            <p className="mt-1 text-sm text-muted">
                Move to the front of the oven queue for {formatCurrency(orderPrice * PRIORITY_RATE)} more.
            </p>
            <Button type="small" disabled={isUpdating} className="mt-4 w-full">
                {isUpdating ? "Updating…" : "Make it priority"}
            </Button>
        </fetcher.Form>
    )
}

export default UpdateOrder

export async function action({ params }: ActionFunctionArgs) {
    const orderId = params.orderId;

    if (!orderId) throw new Error("Order ID is required");

    const data = { priority: true };
    await updateOrder(orderId, data);
    store.dispatch(markPriority(orderId));
    return null;
}
