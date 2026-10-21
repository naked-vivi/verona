import { Link, useNavigate, type To } from "react-router-dom"

interface linkButtonProps {
    children: React.ReactNode;
    to: To;
}

function LinkButton({ children, to }: linkButtonProps) {
    const navigate = useNavigate();
    const classname = 'inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent focus:outline-none focus-visible:text-accent focus-visible:underline'

    if (to === "-1")
        return <button type="button" className={classname} onClick={() => navigate(-1)}>{children}</button>

    return (
        <Link to={to} viewTransition className={classname}>
            {children}
        </Link>
    )
}

export default LinkButton
