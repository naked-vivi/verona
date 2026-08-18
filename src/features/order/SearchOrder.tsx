import { useState } from "react"
import { useNavigate } from "react-router-dom";


function SearchOrder() {
    const [query, setQuery] = useState<string>();
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!query) return;

        navigate(`/order/${query}`)
        setQuery("")
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Search order"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="rounded-full text-sm px-4 py-2 bg-yellow-100 placeholder:text-yellow-400 w-28 sm:w-64
                sm:focus:w-72 transition-all duration-300 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
            />
        </form>
    )
}

export default SearchOrder