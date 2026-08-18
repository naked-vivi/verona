import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";
import type { Pizza } from "../../utils/Types";

function Menu() {
  const menu: Pizza[] = useLoaderData();

  return (
    <ul>
      {menu.map((item) => (
        <MenuItem pizza={item} key={item.id} />))}
    </ul>
  )
}

export async function loader() {
  const menu = await getMenu()
  return menu;
}

export default Menu;