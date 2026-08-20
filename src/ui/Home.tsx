import CreateUser from "../features/user/CreateUser";
import Button from "./Button";
import { useAppSelector } from "../store";

function Home() {
  const username = useAppSelector((state) => state.user.username)

  return (
    <div className="text-center my-10 sm:my-16">
      <h1 className="text-xl font-semibold px-4 mb-8 md:text-3xl">
        The best pizza.
        <br />
        <span className="text-yellow-500">
          Straight out of the oven, straight to you.
        </span>
      </h1>

      {username === "" ? <CreateUser /> : <Button to="/menu" type="primary">Continue Ordering, {username}</Button>}
    </div>
  );
}

export default Home;
