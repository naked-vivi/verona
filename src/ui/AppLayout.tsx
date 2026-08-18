import Header from './Header'
import CartOverview from '../features/cart/CartOverview'
import { Outlet, useNavigation } from 'react-router-dom'

import LoaderIcon from './LoaderIcon';

function AppLayout() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading"

    return (
        <div className='h-screen grid grid-rows-[auto_1fr_auto]'>
            {isLoading && <LoaderIcon />}

            <Header />

            <div className="overflow-scroll">
                <main className="mx-auto max-w-3xl">
                    <Outlet />
                </main>
            </div>

            <CartOverview />
        </div>
    )
}

export default AppLayout