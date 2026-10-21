import { useAppSelector } from "../../store";

function Username() {
    const username = useAppSelector((state) => state.user.username)

    if (!username) return null;

    return (
        <div className="text-sm text-muted">
            Ciao, <span className="font-medium text-ink">{username}</span>
        </div>
    )
}

export default Username
