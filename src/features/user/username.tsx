import { useAppSelector} from "../../store";

function Username() {
    const username = useAppSelector((state) => state.user.username)

    if (!username) return null;

    return (
        <div className="hidden md:block text-sm font-semibold">{username}</div>
    )
}

export default Username