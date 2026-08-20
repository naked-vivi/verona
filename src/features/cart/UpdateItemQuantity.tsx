import { useDispatch } from "react-redux";
import Button from "../../ui/Button"
import { decreaseItemQuantity, increaseItemQuantity } from "./cartSlice";

interface updateProps {
    pizzaId: number;
    currentQuantity: number;
}

function UpdateItemQuantity({ pizzaId, currentQuantity }: updateProps) {
    const dispatch = useDispatch();

    return (
        <div className="flex gap-2 md:gap-3 items-center">
            <Button type="round" onClick={() => dispatch(increaseItemQuantity(pizzaId))}>+</Button>
            <span className="font-medium text-sm">{currentQuantity}</span>
            <Button type="round" onClick={() => dispatch(decreaseItemQuantity(pizzaId))}>-</Button>
        </div>
    )
}

export default UpdateItemQuantity