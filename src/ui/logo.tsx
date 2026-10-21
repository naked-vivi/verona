import { useId } from "react";

// * Verona's Arena seen from above, drawn as a pizza; toppings are cut out with SVG masks

type Topping = { cx: number; cy: number; r: number } | { leaf: string };

type Slice = {
  cheese: string;
  crust: string;
  toppings: Topping[];
};

const LEAF_PATH = "M-5 0 C-2.5 -4.2 3 -4 5.5 0 C3 4 -2.5 4.2 -5 0 Z";

const SLICES: Slice[] = [
  {
    cheese: "M50.00 49.13 L36.99 24.18 A34 27 0 0 1 63.01 24.18 Z",
    crust: "M34.50 18.18 A40.5 33.5 0 0 1 65.50 18.18",
    toppings: [{ cx: 50.0, cy: 32.93, r: 3.6 }, { cx: 51.22, cy: 41.08, r: 1.6 }],
  },
  {
    cheese: "M55.02 46.01 L68.03 21.07 A34 27 0 0 1 86.43 35.68 Z",
    crust: "M70.52 15.06 A40.5 33.5 0 0 1 92.44 33.19",
    toppings: [{ leaf: "translate(69.45 34.56) rotate(-10.0) scale(0.82)" }],
  },
  {
    cheese: "M51.10 50.00 L82.51 39.67 A34 27 0 0 1 82.51 60.33 Z",
    crust: "M88.52 37.18 A40.5 33.5 0 0 1 88.52 62.82",
    toppings: [{ cx: 71.5, cy: 50.0, r: 3.6 }, { cx: 61.23, cy: 50.97, r: 1.6 }],
  },
  {
    cheese: "M50.78 50.62 L82.19 60.95 A34 27 0 0 1 63.79 75.56 Z",
    crust: "M88.19 63.44 A40.5 33.5 0 0 1 66.28 81.57",
    toppings: [{ cx: 65.2, cy: 62.07, r: 3.6 }],
  },
  {
    cheese: "M50.00 50.87 L63.01 75.82 A34 27 0 0 1 36.99 75.82 Z",
    crust: "M65.50 81.82 A40.5 33.5 0 0 1 34.50 81.82",
    toppings: [{ leaf: "translate(50.00 67.07) rotate(125.0) scale(0.82)" }, { cx: 48.78, cy: 58.92, r: 1.6 }],
  },
  {
    cheese: "M49.22 50.62 L36.21 75.56 A34 27 0 0 1 17.81 60.95 Z",
    crust: "M33.72 81.57 A40.5 33.5 0 0 1 11.81 63.44",
    toppings: [{ cx: 34.8, cy: 62.07, r: 3.6 }],
  },
  {
    cheese: "M48.90 50.00 L17.49 60.33 A34 27 0 0 1 17.49 39.67 Z",
    crust: "M11.48 62.82 A40.5 33.5 0 0 1 11.48 37.18",
    toppings: [{ cx: 28.5, cy: 50.0, r: 3.6 }, { cx: 38.77, cy: 49.03, r: 1.6 }],
  },
  {
    cheese: "M49.22 49.38 L17.81 39.05 A34 27 0 0 1 36.21 24.44 Z",
    crust: "M11.81 36.56 A40.5 33.5 0 0 1 33.72 18.43",
    toppings: [{ leaf: "translate(34.80 37.93) rotate(260.0) scale(0.82)" }],
  },
];

interface LogoMarkProps {
  className?: string;
  title?: string;
}

export function LogoMark({ className, title }: LogoMarkProps) {
  // * Mask ids must be unique on the page
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        {SLICES.map((slice, i) => (
          <mask key={i} id={`${uid}-slice-${i}`} maskUnits="userSpaceOnUse" x="-10" y="-10" width="120" height="120">
            <rect x="-10" y="-10" width="120" height="120" fill="#fff" />
            <g fill="#000">
              {slice.toppings.map((t, j) =>
                "leaf" in t ? (
                  <path key={j} transform={t.leaf} d={LEAF_PATH} />
                ) : (
                  <circle key={j} cx={t.cx} cy={t.cy} r={t.r} />
                )
              )}
            </g>
          </mask>
        ))}
      </defs>
      {SLICES.map((slice, i) => (
        <g key={i} mask={`url(#${uid}-slice-${i})`}>
          <path d={slice.cheese} fill="currentColor" />
          <path d={slice.crust} fill="none" stroke="currentColor" strokeWidth={7} />
        </g>
      ))}
    </svg>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2.5 sm:gap-3">
      <LogoMark className="h-8 w-8 shrink-0 text-accent sm:h-10 sm:w-10" />
      <span className="flex flex-col">
        <span className="font-display text-lg uppercase leading-none tracking-[0.3em] text-ink sm:text-[1.4rem]">
          Verona
        </span>
        <span className="mt-1 hidden text-[0.5rem] font-medium uppercase leading-none tracking-[0.24em] text-accent min-[400px]:block sm:text-[0.55rem]">
          Pizzeria · dal forno a te
        </span>
      </span>
    </span>
  );
}

export default Logo;
