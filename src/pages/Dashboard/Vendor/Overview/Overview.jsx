import { useState, useEffect } from "react";
import { useAuth } from "../../../../utils/hooks/useAuth";
import { Link } from "react-router-dom";
import InlineSpinner from "../../../../components/InlineSpinner/InlineSpinner";
import Toast from "../../../../components/Toast/Toast";
import { supabase } from "../../../../lib/supabase";
import { formatToNaira } from "../../../../utils/helpers/formatToNaira";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";

const Overview = () => {
    const { sessionUserData } = useAuth();
    const [overviewData, setOverviewData] = useState({
        products: 0,
        orders: 0,
        totalEarned: 0,
        escrowBalance: 0
    });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const isWide = useWindowSize();
    const name =  sessionUserData.display_name;

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async () => {
        setLoading(true);

        // get user id 
        const { data: claims } = await supabase.auth.getClaims();
        const vendorId = claims.claims.sub;
        
        // Fetch count of "Products" table
        try {
            const { count, error } = await supabase
                .from('Products')
                .select('*', { count: 'exact', head: true })
                .eq("vendor_id", vendorId);
    
            if (!error) setOverviewData(prev => ({...prev, products: count}));
        } catch (error) {
            setToast({
                type: "error",
                message: "Failed to fetch count of orders."
            });
        }

        // Fetch count of "orders" table
        try {
            const { count, error } = await supabase
                .from('orders')
                .select('*', { count: 'exact', head: true })
                .eq("vendor_id", vendorId);
    
            if (!error) setOverviewData(prev => ({...prev, orders: count}));
        } catch (error) {
            setToast({
                type: "error",
                message: "Failed to fetch count of orders."
            });
        }

        // Fetch sum of "amount_paid" in "orders" table with the vendor_id
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('amount_paid')
                .eq("vendor_id", vendorId);
            
            if (!error && data) {
                const total = data.reduce((acc, curr) => acc + Number(curr.amount_paid), 0);
                setOverviewData(prev => ({...prev, totalEarned: total}));
            }
        } catch (error) {
            setToast({
                type: "error",
                message: "Failed to fetch total earned."
            });
        }

        // Fetch sum of "amount_paid" in "orders" table with the vendor_id and escrow_status = 'held'
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('amount_paid')
                .eq("vendor_id", vendorId)
                .eq("escrow_status", "held");
            
                if (!error && data) {
                const total = data.reduce((acc, curr) => acc + Number(curr.amount_paid), 0);
                setOverviewData(prev => ({...prev, escrowBalance: total}));
            }
        } catch (error) {
            setToast({
                type: "error",
                message: "Failed to fetch escrow balance."
            });
        }

        setLoading(false);
    }

    const getAmount = (title) => {
        switch(title) {
            case "Products": 
                return Number(overviewData.products);
            case "Orders":
                return Number(overviewData.orders);
            case "Total Earned":
                return formatToNaira(Number(overviewData.totalEarned));
            case "Escrow Balance":
                return formatToNaira(Number(overviewData.escrowBalance));
            default: 
                return 0;
        }
    }

    const handleCopyVendorLink = () => {
        const vendorLink = `${window.location.origin}/vendors/${sessionUserData.slug}`;
        navigator.clipboard.writeText(vendorLink);
        setToast({ 
            type: "success",
            message: "Vendor link copied to clipboard!"
        });
    }

    const salesDiv =[
        {
            Title:"Products",
            amount: 0,
            icon:(<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-[#310EB7] size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>
            ),
            color: "#135CEE33"
        },
        {
            Title:"Orders",
            amount: 0,
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-[#2FA211] size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                </svg>
            ),
            color: "#2FA2111A"

        },
        {
            Title:"Total Earned",
            amount: 0,
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-[#EDDC21] size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ),
            color: "#FFF4784D"

        },
        {
            Title:"Escrow Balance",
            amount: 0,
            icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-[#3C173E] size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                </svg>
            ),
            color: "#3C173E4D"
        },
    ];

    return (
        <div className="overflow-x-hidden" >
            {toast && (
                <Toast 
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="flex gap-5 mt-2 md:mt-0 justify-between items-center">
                <div className="space-y-2">
                    <h1 className="text-lg sm:text-2xl md:text-3xl text-[var(--primary-color)] font-bold">Welcome, {isWide ? name: name.split(" ")[0]}!</h1>
                    <p className="text-md">Here's your dashboard overview</p>
                </div>
                <Link
                    to="create"
                    className="bg-[var(--primary-color)] transition-colors duration-300 h-fit px-3 text-sm font-medium py-2 rounded-md flex justify-center text-gray-100 items-center"
                >
                    <span className="text-2xl md:pr-2">+</span> {isWide && "Product"}
                </Link>
            </div>

            {/* cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {salesDiv.map((item, index) => (
                    <div key={index} className="bg-white border-2 border-gray-400/10 p-6 rounded-lg shadow-md flex items-center">
                        <div
                            className="flex-shrink-0 p-3 text-2xl rounded-[50%] flex items-center justify-center"
                            style={{ backgroundColor: item.color || "#f3f4f6" }}
                        >
                            {item.icon}
                        </div>
                        <div className="ml-4 space-y-2">
                            <h3 className="font-semibold">{item.Title || "N/A"}</h3>
                            <p className="sm:text-lg md:text-xl font-bold">
                                {loading ? (
                                    <InlineSpinner />
                                ) : (
                                    getAmount(item.Title)
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex mt-5 sm:mt-15 shadow-md p-4 sm:p-10 border-2 rounded-md border-gray-400/10 flex-col">
                    <h2 className="font-bold sm:text-xl">Public Checkout Link</h2>
                    <div className="mt-5 flex items-center gap-5 ">
                        <p className="text-sm sm:text-base">Here's your public product listing - click the copy icon and share link with customers.</p>
                        <div 
                            className="hover:cursor-pointer p-4 hover:rounded-full hover:bg-neutral-200 hover:text-gray-600 ease-transition"
                            onClick={handleCopyVendorLink}
                        >
                            {toast && toast.message === "Vendor link copied to clipboard!" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                            ): (
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 font-bold"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex mt-5 sm:mt-15 shadow-md p-4 sm:p-10 border-2 rounded-md border-gray-400/10 flex-col">
                    <h2 className="font-bold sm:text-xl">Edit Profile Details</h2>
                    <div className="mt-5 text-sm sm:text-base flex items-center gap-5 ">
                        <p>Click the button to update your profile details like description and so on.</p>
                        <Link
                            to="settings"
                            className="
                                bg-[var(--primary-color)] transition-colors duration-300 px-4 text-sm font-medium py-2 rounded-md flex justify-center 
                                text-gray-100 items-center gap-2
                            "
                        >
                            <span>Edit</span>
                            {/* Edit Icon */}
                            {isWide && (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            )}
                        </Link>
                    </div>     
                </div>
            </div>      
               
            <div className="flex mt-5 shadow-md p-4 sm:p-10 border-2 rounded-md border-gray-400/10 flex-col">
                <div><h2 className="font-bold sm:text-xl">Bank Verification</h2></div>
                {sessionUserData.account_number === "" || sessionUserData.bank_name === "" ? (
                    <div className="mt-5 text-sm sm:text-base flex items-center gap-5 ">
                        <div className="p-3 bg-red-100 text-red-600 rounded-[50%]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-red-500 font-semibold">Unverified</p>
                            <p className="font-medium text-sm sm:text-base">Your bank details have not been verified</p>
                            <Link
                                to="kyc#AddBank"
                                className="text-[var(--primary-color)] underline text-xs ease-transition hover:font-semibold"
                            >
                                Click here to update bank details.
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="mt-5 text-sm sm:text-base flex items-center gap-5 ">
                        <div className="p-3 bg-[#2FA21133] text-[#2FA211] rounded-[50%]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-[#2FA211] font-semibold">Verified</p>
                            <p className="font-medium">Your bank details have been successfully verified</p>
                        </div>
                    </div>
                )}
            </div>

            {/* KYC Verification Status */}
            {/* <div className="flex mt-5 shadow-md p-4 sm:p-10 border-2 rounded-md border-gray-400/10 flex-col">
                <div><h2 className="font-bold sm:text-xl">KYC Status</h2></div>
                <div className="mt-5 text-sm sm:text-base flex items-center gap-5 ">
                    <div className="p-3 bg-[#2FA21133] text-[#2FA211] rounded-[50%]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[#2FA211] font-semibold">Verified</p>
                        <p className="font-medium">Your KYC document has been successfully verified</p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default Overview;
