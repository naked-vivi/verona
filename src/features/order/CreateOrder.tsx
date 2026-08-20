import { Form, redirect, useActionData, useNavigation, type ActionFunctionArgs } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import store, { useAppDispatch, useAppSelector } from "../../store";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";

import { fetchAddress } from "../user/userSlice";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );


function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const { username, status: addressStatus, position, address, error: errorAddress } = useAppSelector((state) => state.user)
  const isLoadingAddress = addressStatus === "loading";

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"
  const formErrors = useActionData() as { phone?: string } | undefined;
  const dispatch = useAppDispatch();

  const cart = useAppSelector(getCart)

  const totalCartPrice = useAppSelector(getTotalCartPrice)
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;
  const hasPosition =
    position.latitude !== undefined && position.longitude !== undefined;

  if (!cart.length) return <EmptyCart />

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      <Form method="POST">
        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input className="input grow" type="text" name="customer" defaultValue={username} required />
        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
            {formErrors?.phone &&
              <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{formErrors.phone}</p>}
          </div>

        </div>

        <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="relative grow">
            <input
              className={`input w-full ${!hasPosition ? "pr-36 md:pr-44" : ""}`}
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required />
            {addressStatus === 'error' &&
              <p className="text-xs mt-2 text-red-700 bg-red-100 p-2 rounded-md">{errorAddress}</p>}
            {!hasPosition &&
              (<span className="absolute right-1 top-1/2 z-50 -translate-y-1/2">
                <Button
                  disabled={isLoadingAddress}
                  type="small"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(fetchAddress())
                  }}>
                  Get Position
                </Button>
              </span>)}
          </div>
        </div>

        <div className="mb-12 flex gap-5 items-center">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="w-6 h-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            checked={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={position.latitude && position.longitude ? `${position.latitude},${position.longitude}` : ""}
          />
          <Button type="primary" disabled={isSubmitting || isLoadingAddress} >
            {isSubmitting ? "Placing order..." : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  //always use this two
  const formData = await request.formData();
  const data = Object.fromEntries(formData); // convert to object

  const order = {
    ...data,
    phone: data.phone as string,
    cart: JSON.parse(data.cart as string),
    priority: data.priority === "on"
  };

  const errors: { phone?: string } = {};
  if (!isValidPhone(order.phone))
    errors.phone = "Please provide a valid phone number of yours"

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order); //to redirect that new order

  store.dispatch(clearCart());// do not overuse

  return redirect(`/order/${newOrder.id}`)

}

export default CreateOrder;
