import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./ui/Home"
import Menu, { loader as menuLoader } from "./features/menu/Menu"
import Cart from "./features/cart/Cart"
import Order, { loader as orderLoader } from "./features/order/Order"
import CreateOrder, { action as orderAction } from "./features/order/CreateOrder"
import AppLayout from "./ui/AppLayout"
import Error from "./ui/Error"

const router = createBrowserRouter([
  {
    Component: AppLayout,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        // element: <Home />
        Component: Home
      },
      {
        path: "/menu",
        Component: Menu,
        loader: menuLoader,
        errorElement: <Error />,
      },
      {
        path: "/cart",
        Component: Cart
      },
      {
        path: "/order/new",
        Component: CreateOrder,
        action: orderAction,
        errorElement: <Error />
      },
      {
        path: "/order/:orderId",
        Component: Order,
        loader: orderLoader,
        errorElement: <Error />
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router}>

    </RouterProvider>
  )
}

export default App