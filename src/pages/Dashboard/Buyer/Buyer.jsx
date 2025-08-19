import Sidebar from '../../../components/Sidebar/Sidebar';
import Orders from './Orders/Orders';
import SavedVendors from './SavedVendors/SavedVendors';
import Settings from '../Settings/Settings';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';

const BuyerDashboardLayout = () => {
    return (
        <div className='ml-[285px] p-6 md:p-12 md:ml-[325px]'>
            <Sidebar />
            <Outlet />
        </div>
    )
}

const BuyerDashboard = () => {
    return (
        <Routes>
            <Route path='/' element={<BuyerDashboardLayout />}>
                <Route index element={<Navigate replace to="orders" />} />
                <Route path='orders' element={<Orders />} />
                <Route path='saved_suppliers' element={<SavedVendors />} />
                <Route path='settings' element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default BuyerDashboard;
