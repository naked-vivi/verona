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
    <li className="py-3 ">
      <div className="flex items-center justify-between gap-4 text-sm">
        <p>
          <span className="font-bold">{quantity}&times;</span> {name}
        </p>
        <p className="font-bold">{formatCurrency(totalPrice)}</p>
      </div>
    </li>
  );
}



export default OrderItem;
