import { useFetcher, type ActionFunctionArgs } from "react-router-dom"
import Button from "../../ui/Button"
// import type { OrderData } from "../../utils/Types"
import { updateOrder } from "../../services/apiRestaurant";

// interface orderProps {
//     order: OrderData
// }

function UpdateOrder() {
    const fetcher = useFetcher();
    return (
        <fetcher.Form method="PATCH" className="text-right">
            <Button type="primary">Make Priority</Button>
        </fetcher.Form>
    )
}

export default UpdateOrder

export async function action({ params }: ActionFunctionArgs) {
    const orderId = params.orderId;

    if (!orderId) throw new Error("Order ID is required");

    const data = { priority: true };
    await updateOrder(orderId, data);
    return null;
}