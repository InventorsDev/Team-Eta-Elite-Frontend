import { useState, useEffect, use } from "react";
import starRating from "../../../../components/Star/starRating";
import { Link } from "react-router-dom";
import EmptyListUI from "../../../../components/EmptyListUI/EmptyListUI";
import Toast from "../../../../components/Toast/Toast";
import { supabase } from "../../../../lib/supabase";

const SavedVendors = () => {
    const [savedVendorsList, setSavedVendorsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const savedVendors = [
        {
            id: 1,
            name: "Eta-Elite Furniture",
            description: "Specializes in all kinds of furniture and home materials",
            rating: 5,
            reviews: 124,
        },
        {
            id: 2,
            name: "Tech Solutions",
            description: "Specializes in all kinds of laptops and tech accesories",
            rating: 1,
            reviews: 200,
        },
        {
            id: 3,
            name: "Daniel Software Agency",
            description: "Provides solutions to your tech website",
            rating: 4,
            reviews: 102,
        },
        {
            id: 4,
            name: "Confidence Fashions",
            description: "Specializes in all kinds of ladies wears and accesories",
            rating: 3,
            reviews: 73,
        },
        {
            id: 5,
            name: "Priscilla Foods",
            description: "Specializes in all kinds of foods and catering services",
            rating:0,
            reviews: 150,
        },
        {
            id: 5,
            name: "Yakoyo Foods",
            description: "Specializes in all kinds of foods and catering services",
            rating: 2,
            reviews: 15,
        },
    ];

    useEffect(() => {
        fetchedSavedVendors();
    }, []);

    const fetchedSavedVendors = async () => {
        const { data: claims } = await supabase.auth.getClaims();
        const buyerId = claims.claims.sub;

        try {
            const { data, error } = await supabase
                .from('saved_vendors')
                .select('*')
                .eq('buyer_id', buyerId);

            if (error) {
                setToast({
                    type: "error",
                    message: error.message || "Failed to fetch saved vendors"
                });
                console.log("Error fetching saved vendors:", error);
                throw new Error(error);
            }

            if (data) {
                setSavedVendorsList(data);
                setToast({ 
                    type: "success",
                    message: "Saved vendors fetched successfully"
                });
            }
        } catch (error) {
            console.error("Error fetching saved vendors:", error);
            setToast({
                type: "error",
                message: error.message || "An unexpected error occurred"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {toast && (
                <Toast 
                    type={toast?.type}
                    message={toast?.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="mt-2 md:mt-0">
                <h1 className="text-lg md:text-2xl font-bold">Saved Vendors</h1>
            </div>
            
            {loading && (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="border-2 border-[#00000003] p-6 flex flex-col rounded-[10px] shadow-md animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-gray-300 rounded w-full mt-auto"></div>
                        </div>
                    ))}
                </div>
            )}
            
            {savedVendorsList.length > 0 && !loading && (
                <div className="mt-5 md:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                    {savedVendorsList.map((vendor) => (
                        <div key={vendor.vendor_id} className="relative border-2 mb-2 border-[#00000003]  p-6 flex flex-col rounded-[10px] shadow-md ">
                            <h2 className="font-bold sm:text-lg">{vendor.vendor_name}</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                fill="#0000001A" viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="#0000001A" 
                                className=" absolute top-5 right-2 size-4">
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M17.593 
                                        3.322c1.1.128 1.907 1.077 1.907 
                                        2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 
                                        1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>
                            <p className="text-neutral-500 my-2 text-sm md:text-base font-normal">{vendor.description}</p>
                            <div className="flex my-5 flex-wrap items-center justify-between">
                                {starRating({ rating: 0 })}
                                <span className="text-neutral-500 text-[15px] font-semibold">
                                    (0 reviews)
                                </span>
                            </div>
                            <Link 
                                to={`/vendors/${vendor.slug}`}
                                className="
                                    text-sm md:text-base text-center mt-auto cursor-pointer hover:scale-103 transition-all active:scale-100 
                                    bg-[var(--primary-color)] text-white px-4 py-2 rounded-[10px]
                                "
                            >
                                View Catalog
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {savedVendorsList.length === 0 && !loading &&
                <EmptyListUI 
                    heading={"Opps, You have no saved vendors"}
                    subheading={"Start Saving favorite vendors to see them here"}
                />
            }
        </div>
    );
}

export default SavedVendors;
