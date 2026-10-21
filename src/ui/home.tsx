import CreateUser from "../features/user/create-user";
import Button from "./button";
import { useAppSelector } from "../store";
import { LogoMark } from "./logo";
import useTitle from "../hooks/use-title";

function Home() {
  const username = useAppSelector((state) => state.user.username)
  useTitle("Home")

  return (
    // Fills the space below the header (minus the page padding, so nothing scrolls)
    // and centers the hero in it, the same way as the error pages
    <section className="relative isolate flex min-h-[calc(100dvh-14rem)] flex-col items-center justify-center overflow-x-clip px-2 text-center md:min-h-[calc(100dvh-15.5rem)]">
      {/* Large faint pizza behind the headline */}
      <LogoMark className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 text-accent opacity-[0.05] sm:h-[44rem] sm:w-[44rem]" />

      <p className="animate-rise-in text-xs font-medium uppercase tracking-[0.4em] text-accent">
        Pizzeria · Verona
      </p>

      <h1 className="animate-rise-in mt-6 max-w-4xl font-display text-5xl leading-[1.05] [animation-delay:80ms] sm:text-6xl md:text-7xl">
        The best pizza.
        <br />
        <span className="text-accent">Straight out of the oven, straight to you.</span>
      </h1>

      {/* Ornament: line · diamond · line */}
      <div aria-hidden="true" className="animate-rise-in my-10 flex items-center gap-3 text-accent [animation-delay:160ms]">
        {/* Thin grey lines that fade out towards the edges, solid next to the diamond.
            Drawn as a gradient *border* (not a 1px background), because borders always
            take at least one screen pixel, so they don't vanish when the page is zoomed out. */}
        <span className="w-24 border-t [border-image:linear-gradient(to_right,transparent,rgb(var(--color-ink)/0.3))_1] sm:w-40" />
        <span className="h-1.5 w-1.5 rotate-45 bg-current" />
        <span className="w-24 border-t [border-image:linear-gradient(to_left,transparent,rgb(var(--color-ink)/0.3))_1] sm:w-40" />
      </div>

      <div className="animate-rise-in w-full [animation-delay:240ms]">
        {username === "" ? (
          <CreateUser />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-muted">Bentornato, {username}.</p>
            <Button to="/menu" type="primary">Continue ordering</Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;
