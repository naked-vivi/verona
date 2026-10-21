import Button from "./button";
import ErrorView from "./error-view";

// Big outlined "404" that fades out towards the title. Decorative only, so screen
// readers skip it and read the page's real heading instead.
const big404 = (
  <p
    aria-hidden="true"
    className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 select-none bg-gradient-to-b from-accent/30 to-muted/10 bg-clip-text font-[ui-monospace,SFMono-Regular,Menlo,monospace] text-[140px] font-semibold uppercase leading-none tracking-tighter text-transparent [-webkit-mask-image:linear-gradient(to_bottom,black,black_20%,transparent_80%)] [-webkit-text-stroke:2px_rgb(var(--color-accent)/0.6)] [mask-image:linear-gradient(to_bottom,black,black_20%,transparent_80%)] sm:text-[200px] sm:[-webkit-text-stroke:3px_rgb(var(--color-accent)/0.6)]"
  >
    404
  </p>
);

function NotFound() {
  return (
    <ErrorView
      backdrop={big404}
      eyebrow="Page not found"
      title="This page wandered off"
      message="The page you're looking for doesn't exist or has moved. The pizzas are still where you left them."
    >
      <Button type="primary" to="/menu">Back to the menu</Button>
      <Button type="secondary" to="/">Home</Button>
    </ErrorView>
  );
}

export default NotFound;
