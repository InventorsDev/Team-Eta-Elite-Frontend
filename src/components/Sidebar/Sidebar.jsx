import { useState } from "react";
import { useAuth } from "../../utils/hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import InlineSpinner from "../InlineSpinner/InlineSpinner";
import Toast from "../Toast/Toast";
import Button from "../Button/Button";

const Sidebar = ({ forVendor }) => {
    const [toast, setToast] = useState(null);
    const { logout, logoutState } = useAuth();
    const location = useLocation();
    const pathname = location.pathname;
    const vendorDashboardLinks = [
        {
            name: "Dashboard",
            path: `/dashboard/vendor`,
            icon: "/icons/sidebar/dashboard.svg"
        },
        {
            name: "My Products",
            path: `/dashboard/vendor/products`,
            icon: "/icons/sidebar/my_products.svg"
        },
        {
            name: "My Orders",
            path: `/dashboard/vendor/orders`,
            icon: "/icons/sidebar/orders.svg"
        },
        {
            name: "Create Product",
            path: `/dashboard/vendor/create`,
            icon: "/icons/sidebar/product.svg"
        },
        {
            name: "KYC Verification",
            path: `/dashboard/vendor/kyc`,
            icon: "/icons/sidebar/kyc.svg"
        },
        {
            name: "Settings",
            path: `/dashboard/vendor/settings`,
            icon: "/icons/sidebar/settings.svg"
        },
    ];
    
    const buyerDashboardLinks = [
        {
            name: "Orders",
            path: `/dashboard/buyer/`,
            icon: "/icons/sidebar/dashboard.svg"
        },
        {
            name: "Saved Vendors",
            path: `/dashboard/buyer/vendors`,
            icon: "/icons/sidebar/my_products.svg"
        },
        {
            name: "Settings",
            path: `/dashboard/buyer/settings`,
            icon: "/icons/sidebar/settings.svg"
        },
    ];
    
    return (
        <nav id='Sidebar' className='bg-[var(--primary-color)] z-20 text-white w-[280px] md:w-[320px] p-12 pl-0 fixed top-0 left-0 h-[100dvh]'>
            {toast && (
                <Toast 
                    type='success'
                    message={logoutState.message}
                    onClose={() => setTimeout(() => setToast(null), 3000)}
                />
            )}

            <h1 className="font-headings text-3xl font-extrabold text-center">SAFELINK</h1>

            <ul className="my-8 space-y-6">
                {forVendor ? (
                    vendorDashboardLinks.map((link) => 
                        <li key={link.name} className={`
                            my-6 pl-12 text-center ${link.path === pathname && "sidebar-link-active"}
                            hover:scale-[105%] hover:transition-transform hover:duration-200 hover:ease-in-out
                        `}>
                            <Link to={link.path} className="flex items-center gap-2">
                                <img src={link.icon} alt={link.name} className="w-5 h-5" />
                                {link.name}
                            </Link>
                        </li>
                    )
                ) : (
                    buyerDashboardLinks.map((link) => 
                        <li key={link.name} className={`
                            my-6 pl-12 text-center ${link.path === pathname && "sidebar-link-active"}
                            hover:scale-[105%] hover:transition-transform hover:duration-200 hover:ease-in-out
                        `}>
                            <Link to={link.path} className="flex items-center gap-2">
                                <img src={link.icon} alt={link.name} className="w-5 h-5" />
                                {link.name}
                            </Link>
                        </li>
                    )
                )}
            </ul>

            <button  disabled={logoutState.loading} onClick={logout} className={`
                text-white border-white cursor-pointer w-full p-2 pl-12 rounded-r-xl mt-[100%] hover:bg-gray-600
                hover:scale-[105%] hover:transition-transform hover:duration-200 hover:ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
            `}>
                {logoutState.loading
                    ? <span className="flex items-center text-sm"><InlineSpinner className="pr-2" /> Logging out...</span> 
                    : (
                        <span className="flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                            </svg>
                            <p>Logout</p>
                        </span>
                    )
                }
            </button>
        </nav>
    );
}

export default Sidebar;
