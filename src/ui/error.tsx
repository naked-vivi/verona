import { isRouteErrorResponse, useRevalidator, useRouteError } from 'react-router-dom';
import Button from './button';
import ErrorView from './error-view';
import NotFound from './not-found';
import orderErrorAnimation from '../assets/order-error.lottie?url';
import useTitle from '../hooks/use-title';

// * Not named Error, so `instanceof Error` below still means the built-in class
function RouteError() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  // * React Router gives null when there's no error, i.e. the catch-all "*" route rendered this
  const isNotFound = error == null || (isRouteErrorResponse(error) && error.status === 404);

  const message = (
    error instanceof Error
      ? error.message
      : isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : "Something unexpected happened"
  ).replace(/\.$/, "");

  const isMissingOrder = /couldn.t find order/i.test(message);

  useTitle(isNotFound ? "Page not found" : isMissingOrder ? "Order not found" : "Something went wrong");

  if (isNotFound) return <NotFound />;

  if (isMissingOrder) {
    return (
      <ErrorView
        animation={orderErrorAnimation}
        eyebrow="Order not found"
        title="We couldn't find that order"
        message={`${message}. Check the ID in your confirmation and try again. Order IDs look like IIDSAT.`}
      >
        <Button type="primary" to="/menu">Back to the menu</Button>
      </ErrorView>
    );
  }

  return (
    <ErrorView
      animation={orderErrorAnimation}
      eyebrow="Something went wrong"
      title="Our oven hiccupped"
      message={`${message}. Please check your connection and try again.`}
    >
      <Button
        type="primary"
        disabled={revalidator.state === "loading"}
        onClick={() => revalidator.revalidate()}
      >
        {revalidator.state === "loading" ? "Trying again…" : "Try again"}
      </Button>
      <Button type="secondary" to="/">Home</Button>
    </ErrorView>
  );
}

export default RouteError;
