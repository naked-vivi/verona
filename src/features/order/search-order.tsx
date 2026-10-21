import { useState } from "react"
import { useNavigate } from "react-router-dom";

function SearchOrder() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const orderId = query.trim().toUpperCase();
        if (!orderId) return;

        navigate(`/order/${orderId}`, { viewTransition: true })
        setQuery("")
    }

    return (
        <form onSubmit={handleSubmit} role="search" className="relative min-w-0">
            <label htmlFor="order-search" className="sr-only">Find an order by its ID</label>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" />
            </svg>
            <input
                id="order-search"
                placeholder="Order #"
                value={query}
                onChange={e => setQuery(e.target.value)}
                autoComplete="off"
                className="w-28 rounded-full border border-transparent bg-subtle py-2 pl-9 pr-4 text-sm uppercase text-ink placeholder:normal-case placeholder:text-muted transition-all duration-300 focus:border-line focus:bg-surface focus:outline-none focus:ring focus:ring-accent/30 sm:w-56 sm:focus:w-64"
            />
        </form>
    )
}

export default SearchOrder
