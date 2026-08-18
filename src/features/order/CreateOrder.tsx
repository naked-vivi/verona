import { Form, redirect, useActionData, useNavigation, type ActionFunctionArgs } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting"
  // const [withPriority, setWithPriority] = useState(false);
  const formErrors = useActionData();

  const cart = fakeCart;
  void cart;
  void isValidPhone;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>

        <div>
          <label>Address</label>
          <div>
            <input
              className="rounded-full w-full border border-stone-200 px-4 py-2 text-sm transition-all duration-300
              focus:outline-none focus:ring focus:ring-yellow-400 md:px-6 md:py-3"
              type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="w-6 h-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
          // value={withPriority}
          // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button disabled={isSubmitting}
            className="inline-block bg-yellow-400 text-stone-800 font-semibold px-4 py-3 uppercase tracking-wide rounded-full
            hover:bg-yellow-300 transition-colors duration-300
            focus:outline-none focus:ring focus:ring-yellow-300 focus:bg-yellow-300 focus:ring-offset-2
            disabled:cursor-not-allowed">
            {isSubmitting ? "Placing order..." : "Order now"}
          </button>
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

  return redirect(`/order/${newOrder.id}`)

}

export default CreateOrder;
