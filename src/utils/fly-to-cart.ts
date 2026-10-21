// "Add to cart" animation: a copy of the pizza photo arcs from the menu
// into the cart bar, then the cart bar gives a small bounce.

export const CART_LANDED_EVENT = "cart:landed";

const FLIGHT_MS = 760;
const START_SIZE = 96;
const END_SIZE = 26;

export function flyToCart(source: HTMLImageElement | null) {
  if (!source) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    window.dispatchEvent(new Event(CART_LANDED_EVENT));
    return;
  }

  // Wait one frame: on the first add, the cart bar only appears after this render
  requestAnimationFrame(() => {
    const from = source.getBoundingClientRect();
    const target = document.querySelector<HTMLElement>("[data-cart-target]");
    const to = target?.getBoundingClientRect() ?? {
      left: window.innerWidth / 2 - END_SIZE / 2,
      top: window.innerHeight - 64,
      width: END_SIZE,
      height: END_SIZE,
    };

    const size = Math.min(from.width, from.height, START_SIZE);
    const startX = from.left + (from.width - size) / 2;
    const startY = from.top + (from.height - size) / 2;
    const dx = to.left + to.width / 2 - (startX + size / 2);
    const dy = to.top + to.height / 2 - (startY + size / 2);
    const endScale = END_SIZE / size;
    // Lift the pizza up first, so the path is an arc rather than a straight line
    const lift = Math.min(160, Math.abs(dy) * 0.35 + 60);

    const flyer = source.cloneNode() as HTMLImageElement;
    flyer.removeAttribute("id");
    flyer.alt = "";
    flyer.setAttribute("aria-hidden", "true");
    Object.assign(flyer.style, {
      position: "fixed",
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${size}px`,
      height: `${size}px`,
      margin: "0",
      borderRadius: "9999px",
      objectFit: "cover",
      zIndex: "60",
      pointerEvents: "none",
      willChange: "transform, opacity",
    });
    document.body.appendChild(flyer);

    const animation = flyer.animate(
      [
        { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${dx * 0.4}px, ${dy * 0.4 - lift}px) scale(${(1 + endScale) / 1.6}) rotate(120deg)`,
          opacity: 1,
          offset: 0.45,
        },
        { transform: `translate(${dx}px, ${dy}px) scale(${endScale}) rotate(300deg)`, opacity: 0.4 },
      ],
      { duration: FLIGHT_MS, easing: "cubic-bezier(.55,0,.35,1)" }
    );

    const finish = () => {
      flyer.remove();
      window.dispatchEvent(new Event(CART_LANDED_EVENT));
    };
    animation.onfinish = finish;
    animation.oncancel = finish;
  });
}
