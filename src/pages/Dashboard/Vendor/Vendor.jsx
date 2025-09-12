import Sidebar from '../../../components/Sidebar/Sidebar';
import Overview from './Overview/Overview';
import Products from './Products/Products';
import Orders from './Orders/Orders';
import CreateProduct from './CreateProduct/CreateProduct';
import KYCVerification from './KYCVerification/KYCVerification';
import Settings from '../Settings/Settings';
import { Outlet, Routes, Route } from 'react-router-dom';

const VendorDashboardLayout = () => {
  return (
    <div className="flex min-h-[100dvh] overflow-x-hidden md:overflow-x-hidden sm:mt-10  w-full">
      {/* Sidebar (handles its own collapse on mobile) */}
      <div>
      <Sidebar forVendor />
      </div>

      {/* Main content */}
      <main
        className="
          flex-1 w-full max-w-full
          p-4 sm:p-6 md:p-12
          md:ml-[325px]
          text-sm md:text-base
          overflow-x-hidden
          sm:mt-[-20px] md:mt-0
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

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
};

export default VendorDashboard;
