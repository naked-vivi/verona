import LinkButton from '../../ui/LinkButton';
import Button from '../../ui/Button';
import { useAppSelector } from '../../store';
import { clearCart, getCart } from './cartSlice';
import { useDispatch } from 'react-redux';
import EmptyCart from './EmptyCart';
import CartItem from './CartItem';

function Cart() {
  const username = useAppSelector((state) => state.user.username);
  const cart = useAppSelector(getCart);
  const dispatch = useDispatch();

  if (!cart.length) return <EmptyCart />

  return (
    <div className='px-4 py-3'>
      <LinkButton to="/menu">&larr; Back to menu</LinkButton>

      <h2 className='mt-7 font-semibold text-xl'>Your cart, {username}</h2>

      <ul className="divide-y divide-stone-200 border-b mt-3">
        {cart.map((item) => (
          <CartItem item={item} key={item.pizzaId} />
        ))}
      </ul>

      <div className='mt-6 space-x-2'>
        <Button type='primary' to="/order/new">Order pizza</Button>

        <Button type='secondary' onClick={() => dispatch(clearCart())}>Clear cart</Button>
      </div>
    </div >
  );
}

export default Cart;
