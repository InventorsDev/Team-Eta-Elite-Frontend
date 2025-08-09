import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ forVendor }) => {
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
        </nav>
    );
}

export default Sidebar;
