import Lottie from "./lottie";

interface ErrorViewProps {
  animation?: string;
  backdrop?: React.ReactNode;
  eyebrow: string;
  title: string;
  message: string;
  children?: React.ReactNode;
}

// * Fills the space below the header without making the page scroll, then centers its content
function ErrorView({ animation, backdrop, eyebrow, title, message, children }: ErrorViewProps) {
  return (
    <div className="flex min-h-[calc(100dvh-14rem)] flex-col items-center justify-center md:min-h-[calc(100dvh-15.5rem)]">
      <div
        className={`animate-rise-in relative isolate mx-auto flex max-w-[550px] flex-col items-center text-center ${backdrop ? "pt-36 sm:pt-44" : ""}`}
      >
        {backdrop}
        {animation && <Lottie src={animation} className="h-52 w-52 sm:h-64 sm:w-64" />}
        <p className="mt-6 text-xs font-medium uppercase tracking-[0.35em] text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-muted">{message}</p>
        {children && <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div>}
      </div>
    </div>
  );
}

export default ErrorView;
