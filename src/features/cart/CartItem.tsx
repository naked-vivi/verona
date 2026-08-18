import { formatCurrency } from "../../utils/helpers";

type CartItemData = {
  name: string;
  quantity: number;
  totalPrice: number;
};

function CartItem({ item }: { item: CartItemData }) {
  const { name, quantity, totalPrice } = item;

  return (
    <li>
      <p>
        {quantity}&times; {name}
      </p>
      <div>
        <p>{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}

export default CartItem;
