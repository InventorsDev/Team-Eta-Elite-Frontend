import { useEffect } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Overview from './Overview/Overview';
import Products from './Products/Products';
import Orders from './Orders/Orders';
import CreateProduct from './CreateProduct/CreateProduct';
import KYCVerification from './KYCVerification/KYCVerification';
import Settings from '../Settings/Settings';
import { Outlet, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../utils/hooks/useAuth';

const VendorDashboardLayout = () => {
    const { sessionUserData } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionUserData.role !== "vendor") navigate("/dashboard/buyer/orders");
    }, []);

    return (
        <div className='ml-[285px] p-6 md:p-12 md:ml-[325px]'>
            <Sidebar forVendor />
            <Outlet />
        </div>
    )
}

const VendorDashboard = () => {
    return (
        <Routes>
            <Route path='/' element={<VendorDashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path='products' element={<Products />} />
                <Route path='orders' element={<Orders />} />
                <Route path='create' element={<CreateProduct />} />
                <Route path='kyc' element={<KYCVerification />} />
                <Route path='settings' element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default VendorDashboard;
