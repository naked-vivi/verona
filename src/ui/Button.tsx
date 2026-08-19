import { Link, type To } from "react-router-dom";

interface buttonProps {
    children: React.ReactNode;
    disabled?: boolean;
    to?: To;
    type: 'small' | 'primary';
}

function Button({ children, disabled, to, type }: buttonProps) {
    const base = "inline-block text-sm bg-yellow-400 text-stone-800 font-semibold uppercase tracking-wide rounded-full hover:bg-yellow-300 transition-colors duration-300  focus:outline-none focus:ring focus:ring-yellow-300 focus:bg-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed"

    const style = {
        primary: base + " px-4 py-3 md:px-6 md:py-4",
        small: base + " px-4 py-2 md:px-5 md:py-2.5 text-xs",
        secondary: "inline-block text-sm border-2 border-stone-300 px-4 py-2.5 md:px-6 md:py-3.5 text-stone-800 font-semibold uppercase tracking-wide rounded-full hover:bg-stone-300 hover:text-stone-800 transition-colors duration-300  focus:outline-none focus:ring focus:ring-stone-200 focus:bg-stone-300 focus:text-stone-300 focus:ring-offset-2 disabled:cursor-not-allowed"
    }

    if (to)
        return <Link to={to} className={style[type]}>{children}</Link>

    return (
        <button disabled={disabled} className={style[type]}>{children}</button>
    )
}

export default Button