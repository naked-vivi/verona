import { Link, useNavigate, type To } from "react-router-dom"

interface linkButtonProps {
    children: React.ReactNode;
    to: To;
}

function LinkButton({ children, to }: linkButtonProps) {
    const navigate = useNavigate();
    const classname = 'text-sm text-blue-500 hover:text-blue-600 hover:underline'

    if (to === "-1")
        return <button className={classname} onClick={() => navigate(-1)}>{children}</button>

    return (
        <Link to={to}
            className={classname}>
            {children}
        </Link>
    )
}

export default LinkButton