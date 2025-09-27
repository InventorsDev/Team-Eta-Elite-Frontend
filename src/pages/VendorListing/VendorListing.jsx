import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import Toast from "../../components/Toast/Toast";
import ProductCard from "../../components/ProductCard/ProductCard";
import EmptyListUI from "../../components/EmptyListUI/EmptyListUI";
import Skeleton from "../../components/Skeleton/Skeleton";
import ProductsDetails from "../../components/ProductDetails/ProductsDetails";
import VendorFooter from "../../components/Footer/VendorFooter";
import { useAuth } from "../../utils/hooks/useAuth";

const VendorListing = () => {
    const [searchParams, _] = useSearchParams();
    const productId = searchParams.get("product_id");
    const { slug } = useParams();
    const [productsList, setProductsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingSaveVendor, setLoadingSaveVendor] = useState(false);
    const [userId, setUserId] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [toast, setToast] = useState(null);
    const [showProductDetails, setShowProductDetails] = useState(false);
    const isWide = useWindowSize();
    const { sessionUserData, isAuthenticated } = useAuth();
    const [description, setDescription] = useState("Affordable and high quality products for your needs");

    useEffect(() => {
        if (!slug) return;

        const fetchUserBySlug = async () => {
            setLoading(true);

            try {
                // Query public.profiles for the slug -> user_id mapping
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (error) {
                    setToast({
                        type: "error",
                        message: `Oops, could not find vendor`
                    });
                    console.error('Supabase error fetching profile by slug:', error);
                    setLoading(false);
                    return;
                }

                // note: profile row holds user_id
                setUserId(data?.user_id ?? null);
                setDisplayName(data?.display_name ?? null);
            } catch (err) {
                setToast({
                    type: "error",
                    message: `Unexpected error occured.`
                });
            }
        };

        fetchUserBySlug();
    }, [slug]);

    useEffect(() => {
        if (userId !== null) {
            fetchVendorProducts();
        }
    }, [userId]);

    useEffect(() => {
        if (productId) {
            setShowProductDetails(true);
        } else {
            setShowProductDetails(false);
        }
    }, [productId]);

    const fetchVendorProducts = async () => {
        setLoading(true);

        const { data: Products, error } = await supabase
            .from('Products')
            .select('*')
            .eq("vendor_id", userId);
        
        if (error) {
            setToast({
                type: "error",
                message: error.message || "Failed to Fetch Products"
            })
            throw new Error(error);
        }

        setProductsList(Products);
        setTimeout(() =>  setLoading(false), 1000);
    }

    const handleSaveVendor = async () => {
        if (!userId) {
            setToast({
                type: "error",
                message: "Can't save Invalid vendor"
            });
            return;
        }

        if (!isAuthenticated) {
            setToast({
                type: "error",
                message: "Please login to save vendor"
            });

            // redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
            return;
        }

        setLoadingSaveVendor(true);

        try {
            const { error } = await supabase
                .from('saved_vendors')
                .insert([{ vendor_id: userId, vendor_name: displayName, buyer_id: sessionUserData.sub, slug: slug, description: description}]);

            if (error) {
                if (error.code === "23505") {
                    setToast({
                        type: "error",
                        message: "Vendor already saved"
                    });
                    setLoadingSaveVendor(false);
                    return;
                }

                setToast({
                    type: "error",
                    message: error.message || "Failed to Save Vendor"
                });
                throw new Error(error);
            } else {
                setToast({
                    type: "success",
                    message: "Vendor saved successfully."
                });
            }            
        } catch (error) {
            console.error("Error saving vendor:", error);
            setToast({
                type: "error",
                message: "An unexpected error occurred while saving the vendor."
            });
        } finally {
            setLoadingSaveVendor(false);
        }
    }

    return (
        <div className="bg-gray-100 p-6 space-y-6 sm:space-y-8 sm:p-10 sm:px-16 lg:space-y-12 lg:px-28">
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {showProductDetails && (
                <ProductsDetails productId={productId} vendorName={`${displayName}'s Store`} vendorId={userId} />
            )}

            <header className="w-full flex gap-4 sm:gap-8 items-center">
                <h1 id="logo-in-black" className="mr-auto sm:text-lg font-bold">SAFELINK</h1>
                <div id="search-input" className="items-center hidden sm:flex w-[45%] p-2 px-4 rounded-lg border-2 border-gray-400 text-gray-600 text-sm">
                    <input type="text" className="border-none w-full text-gray-500 outline-none" placeholder="Search Vendor" />
                    {/* search icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <Button onClick={handleSaveVendor} disabled={loadingSaveVendor} type="bg-black" className="flex items-center gap-2 max-w-fit md:max-w-full py-2">
                    <img src="/icons/sidebar/saved_vendors.svg" alt="Save Vendor" className="w-5 h-5" />
                    {loadingSaveVendor && isWide? "Saving...": (isWide && "Save")}
                </Button>
                <Link to={"/dashboard/"} className="px-3 py-2 border-2 border-gray-400 text-gray-600 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z" />
                    </svg>
                    {isWide && "Dashboard"}
                </Link>
            </header>

            <div id="vendor-intro" className="flex flex-col sm:flex-row gap-6">
                <img src="/vendor.jpg" className="rounded-full self-center border-2 border-gray-300 h-30 w-30"/>
                <div id="vendor-name-and-details" className="text-center sm:text-start gap-3 flex flex-col">
                    <h1 className="font-bold sm:text-lg">
                        {loading? <div className="w-[280px] sm:w-[380px]"><Skeleton /></div>: `${displayName !== ""? displayName: "Safelink"}'s Store`}
                    </h1>
                    <div role="paragraph">
                        {loading? <div className="w-[200px] sm:w-[300px]"><Skeleton /></div>: description}
                    </div>
                    <div id="follow-and-chat" className="flex gap-2">
                        <Button type="bg-black" className="py-2 rounded-lg">Review</Button>
                        <Button className="py-2 rounded-lg">{isWide ? "Send a maiil": "Mail"}</Button>
                    </div>
                </div>
            </div>

            {productsList.length === 0 && !loading && (
                <EmptyListUI 
                    heading={"Oops, This Vendor Currently Has No Products Listed."}
                    subheading={"Please check again later"}
                />
            )}

            <div id="product-listing" className="w-full gap-5 flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading && (
                    <>{[...Array(8).keys()].map(index => index + 1).map(index => (
                        <div 
                            className="bg-gray-300 animate-pulse justify-self-center border-2 border-gray-200 relative h-[460px] w-full rounded-lg sm:max-w-[300px]" 
                            key={index}
                        ></div>
                    ))}</>
                )}  

                {!loading && productsList.length > 0 && productsList.map(item => (
                    <ProductCard 
                        key={item.id}
                        id={item.id}
                        productName={item.name}
                        imgSrc={item.image_url}
                        status={item.status}
                        price={item.price}
                    />
                ))}
            </div>

            <div className="absolute left-0 w-full">
                <VendorFooter />
            </div>
        </div>
    );
}

export default VendorListing;
