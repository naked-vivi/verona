import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./ui/home"
import Menu, { loader as menuLoader, shouldRevalidate as menuShouldRevalidate } from "./features/menu/menu"
import MenuSkeleton from "./features/menu/menu-skeleton"
import Cart from "./features/cart/cart"
import Order, { loader as orderLoader } from "./features/order/order"
import OrderSkeleton from "./features/order/order-skeleton"
import OrderHistory, { loader as orderHistoryLoader } from "./features/order/order-history"
import OrdersSkeleton from "./features/order/orders-skeleton"
import { action as updateOrderAction } from "./features/order/update-order"
import CreateOrder, { action as orderAction } from "./features/order/create-order"
import AppLayout from "./ui/app-layout"
import RouteError from "./ui/error"
import NotFound from "./ui/not-found"

const router = createBrowserRouter([
  {
    Component: AppLayout,
    errorElement: <RouteError />,
    children: [
      {
        path: "/",
        Component: Home
      },
      {
        path: "/menu",
        Component: Menu,
        loader: menuLoader,
        shouldRevalidate: menuShouldRevalidate,
        HydrateFallback: MenuSkeleton,
        errorElement: <RouteError />,
      },
      {
        path: "/cart",
        Component: Cart
      },
      {
        path: "/order/new",
        Component: CreateOrder,
        action: orderAction,
        errorElement: <RouteError />
      },
      {
        path: "/orders",
        Component: OrderHistory,
        loader: orderHistoryLoader,
        HydrateFallback: OrdersSkeleton,
        errorElement: <RouteError />,
      },
      {
        path: "/order/:orderId",
        Component: Order,
        loader: orderLoader,
        HydrateFallback: OrderSkeleton,
        errorElement: <RouteError />,
        action: updateOrderAction,
      },
      {
        path: "*",
        Component: NotFound
      }
    ]
  }
])

function Router() {
  return <RouterProvider router={router} />
}

export default Router
