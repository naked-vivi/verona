import Button from "../../ui/button"
import { useCartActions } from "./use-cart-actions";

interface updateProps {
    lineId: string;
    currentQuantity: number;
}

function UpdateItemQuantity({ lineId, currentQuantity }: updateProps) {
    const { increase, decrease } = useCartActions();

    return (
        <div className="flex items-center gap-2 md:gap-3">
            <Button type="round" ariaLabel="Remove one" onClick={() => decrease(lineId)}>&minus;</Button>
            <span className="min-w-[1.5ch] text-center text-sm font-medium tabular-nums" aria-live="polite">{currentQuantity}</span>
            <Button type="round" ariaLabel="Add one more" onClick={() => increase(lineId)}>+</Button>
        </div>
    )
}

export default UpdateItemQuantity
