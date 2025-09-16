import { useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Overview from './Overview/Overview';
import Products from './Products/Products';
import Orders from './Orders/Orders';
import CreateProduct from './CreateProduct/CreateProduct';
import KYCVerification from './KYCVerification/KYCVerification';
import Settings from '../Settings/Settings';
import { Outlet, Routes, Route } from 'react-router-dom';
import TopBar from '../../../components/TopBar/TopBar';

const VendorDashboardLayout = () => {
  // state for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex md:flex-row flex-col min-h-[100dvh] w-full">

      {/* TopBar with menu button */}
      <div 
        className="sticky top-0 bg-white z-30">
        <TopBar  onMenuClick={() => setIsSidebarOpen(true)} />
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30  transition-colors backdrop-blur-[2px] bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div>
        <Sidebar
          forVendor
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
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
      <Route path="/" element={<VendorDashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="create" element={<CreateProduct />} />
        <Route path="kyc" element={<KYCVerification />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default VendorDashboard;
