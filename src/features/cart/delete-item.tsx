import Button from "../../ui/button"
import { useCartActions } from "./use-cart-actions";

interface DeleteItemProps {
    lineId: string;
}

function DeleteItem({ lineId }: DeleteItemProps) {
    const { removeLine } = useCartActions();
    return (
        <Button type="ghost" onClick={() => removeLine(lineId)}>
            Remove
        </Button>
    )
}

export default DeleteItem
