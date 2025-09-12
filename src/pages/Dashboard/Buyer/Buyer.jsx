import Sidebar from '../../../components/Sidebar/Sidebar';
import Orders from './Orders/Orders';
import SavedVendors from './SavedVendors/SavedVendors';
import Settings from '../Settings/Settings';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';

const BuyerDashboardLayout = () => {
  return (
      <div className="flex min-h-[100dvh] overflow-x-hidden m-10  ">
      {/* Sidebar (handles its own mobile overlay) */}
      <div>
      <Sidebar />
      </div>

      {/* Main content */}
      <main
        className="
          flex-1 w-full max-w-full
          p-4 sm:p-6 md:p-12
          md:ml-[325px]
          text-sm md:text-base
          overflow-x-hidden
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

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
};

export default BuyerDashboard;
