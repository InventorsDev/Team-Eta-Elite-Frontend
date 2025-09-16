import { useState } from 'react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import Orders from './Orders/Orders';
import SavedVendors from './SavedVendors/SavedVendors';
import Settings from '../Settings/Settings';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from '../../../components/TopBar/TopBar';

const BuyerDashboardLayout = () => {

  // state for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="flex md:flex-row flex-col min-h-[100dvh] w-full">
      {/* TopBar with menu button */}
      <div className="fixed top-0 left-0 right-0 bg-white z-30">
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isSidebarOpen && (

        <div
          className="fixed w-full inset-0 z-30 transition-colors backdrop-blur-[2px] bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar (handles its own mobile overlay) */}
      <div>
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <main
        className="
          flex-1 w-full max-w-full
          p-4 sm:p-6 md:p-12 
          sm:pt-[90px] pt-[80px]
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
