import Button from '../../ui/button';
import Lottie from '../../ui/lottie';
import pizzaAnimation from '../../assets/pizza.lottie?url';

function EmptyCart() {
  return (
    <div className="animate-rise-in mx-auto flex min-h-[calc(100dvh-14rem)] max-w-md flex-col items-center justify-center text-center md:min-h-[calc(100dvh-15.5rem)]">
      <Lottie src={pizzaAnimation} className="h-48 w-48 sm:h-56 sm:w-56" />
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.35em] text-accent">Il carrello</p>
      <h1 className="mt-3 font-display text-4xl">Your cart is empty</h1>
      <p className="mt-3 text-muted">The oven is hot and the menu is waiting. Pick a favourite to get started.</p>
      <Button type="primary" to="/menu" className="mt-8">Browse the menu</Button>
    </div>
  );
}

export default EmptyCart;
