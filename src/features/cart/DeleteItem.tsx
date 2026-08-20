import { useDispatch } from "react-redux"
import Button from "../../ui/Button"
import { deleteItem } from "./cartSlice";

interface DeleteItemProps {
    pizzaId: number; // Or number, depending on your data type
}

function DeleteItem({ pizzaId }: DeleteItemProps) {
    const dispatch = useDispatch();
    return (
        <Button type="small" onClick={() => dispatch(deleteItem(pizzaId))}>
            Delete
        </Button>
    )
}

export default DeleteItem