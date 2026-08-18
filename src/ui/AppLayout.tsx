import Header from './Header'
import CartOverview from '../features/cart/CartOverview'
import { Outlet, useNavigation } from 'react-router-dom'
import Loader from './LoaderIcon';
import SearchOrder from '../features/order/SearchOrder';

function AppLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading"

    return (
        <div className='layout'>
            {isLoading && <Loader />}

            <Header />
            <SearchOrder />

            <main className="">
                <Outlet />
            </main>

            <CartOverview />
        </div>
    )
}

export default AppLayout