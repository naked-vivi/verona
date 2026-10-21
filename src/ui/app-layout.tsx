import { Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router-dom'
import Header from './header'
import CartOverview from '../features/cart/cart-overview'
import MenuSkeleton from '../features/menu/menu-skeleton'
import OrderSkeleton from '../features/order/order-skeleton'
import OrdersSkeleton from '../features/order/orders-skeleton'
import Toaster from './toaster'

// * Show a page-shaped skeleton while the next page's data loads
function usePendingPage() {
    const navigation = useNavigation();
    const location = useLocation();

    const nextPath = navigation.state === "loading" ? navigation.location?.pathname : undefined;
    // * Menu filter changes only update the query string, so stay on the page
    if (!nextPath || nextPath === location.pathname) return null;

    if (nextPath === "/menu") return <MenuSkeleton />;
    if (nextPath === "/orders") return <OrdersSkeleton />;
    if (nextPath.startsWith("/order/") && nextPath !== "/order/new") return <OrderSkeleton />;
    return null;
}

function AppLayout() {
    const pendingPage = usePendingPage();

    return (
        <Toaster>
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-32 pt-8 sm:px-6 md:pt-14">
                {pendingPage ?? <Outlet />}
            </main>

            <CartOverview />
            <ScrollRestoration />
        </div>
        </Toaster>
    )
}

export default AppLayout
