import { lazy, Suspense } from "react";

// * Loaded on demand so the Lottie player isn't part of the first page load
const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((module) => ({ default: module.DotLottieReact }))
);

interface LottieProps {
  src: string;
  className?: string;
  loop?: boolean;
}

function Lottie({ src, className = "", loop = true }: LottieProps) {
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className={className} aria-hidden="true">
      <Suspense fallback={null}>
        <DotLottieReact src={src} autoplay={!reduceMotion} loop={loop} className="h-full w-full" />
      </Suspense>
    </div>
  );
}

export default Lottie;
