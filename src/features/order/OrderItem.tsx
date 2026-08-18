import { formatCurrency } from "../../utils/helpers";

type OrderItemData = {
  name: string;
  quantity: number;
  totalPrice: number;
};

type OrderItemProps = {
  item: OrderItemData;
  isLoadingIngredients?: boolean;
  ingredients?: string[];
};

function OrderItem({ item }: OrderItemProps) {
  const { quantity, name, totalPrice } = item;

  return (
    <li>
      <div>
        <p>
          <span>{quantity}&times;</span> {name}
        </p>
        <p>{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}



export default OrderItem;
