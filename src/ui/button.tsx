import { Link, type To } from "react-router-dom";

type ButtonVariant = 'small' | 'primary' | 'secondary' | 'outline' | 'round' | 'ghost';

interface buttonProps {
    children: React.ReactNode;
    disabled?: boolean;
    to?: To;
    type: ButtonVariant;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    ariaLabel?: string;
}

const focus = "focus:outline-none focus-visible:ring focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
const disabledStyle = "disabled:cursor-not-allowed disabled:opacity-60"
const filled = `inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-ink font-medium uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-accent-hover ${focus} ${disabledStyle}`

const styles: Record<ButtonVariant, string> = {
    primary: `${filled} px-6 py-3.5 text-sm md:px-8 md:py-4`,
    small: `${filled} px-4 py-2 text-[0.7rem] md:px-5 md:py-2.5`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:border-ink/40 hover:bg-subtle md:px-8 md:py-4 ${focus} ${disabledStyle}`,
    // Same size as `small`, but outlined, for a quieter second action
    outline: `inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:border-ink/40 hover:bg-subtle md:px-5 md:py-2.5 ${focus} ${disabledStyle}`,
    round: `grid h-8 w-8 place-items-center rounded-full border border-line text-base leading-none text-ink transition-colors duration-200 hover:border-accent hover:text-accent md:h-9 md:w-9 ${focus} ${disabledStyle}`,
    ghost: `inline-flex items-center gap-1 rounded-full px-1 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted transition-colors duration-200 hover:text-accent ${focus} ${disabledStyle}`,
}

function Button({ children, disabled, to, type, onClick, className = "", ariaLabel }: buttonProps) {
    const classes = `${styles[type]} ${className}`.trim()

    if (to)
        return <Link to={to} viewTransition aria-label={ariaLabel} className={classes}>{children}</Link>

    // Buttons with a click handler never submit a surrounding form
    return (
        <button
            type={onClick ? "button" : "submit"}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={classes}
        >
            {children}
        </button>
    )
}

export default Button
