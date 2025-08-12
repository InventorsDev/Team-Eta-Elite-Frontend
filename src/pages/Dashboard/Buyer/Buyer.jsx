import { useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Orders from './Orders/Orders';
import SavedVendors from './SavedVendors/SavedVendors';
import Settings from '../Settings/Settings';
import { useAuth } from '../../../utils/hooks/useAuth';
import { Outlet, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

const BuyerDashboardLayout = () => {
    const { sessionUserData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionUserData.role !== "buyer") navigate("/dashboard/vendor/");
    }, []);

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
                <Route path='vendors' element={<SavedVendors />} />
                <Route path='settings' element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default BuyerDashboard;
