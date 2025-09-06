import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatToNaira } from "../../utils/helpers/formatToNaira";
import { supabase } from "../../lib/supabase";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import Button from "../Button/Button";
import InlineSpinner from "../InlineSpinner/InlineSpinner";
import Toast from "../Toast/Toast";

const ProductsDetails = ({ productId }) => {
    const [loading, setLoading] = useState(false);
    const [productDetails, setProductDetails] = useState(null)
    const [toast, setToast] = useState(null);
    const isWide = useWindowSize();
    const navigate = useNavigate();

    useEffect(() => {        
        const fecthProductDetails = async () => {
            if (!productId) {
                return;
            }

            setLoading(true);

            try {
                const { data, error } = await supabase
                    .from("Products")
                    .select("*")
                    .eq("id", productId)
                    .single();

                if (error) {
                    setToast({
                        type: "error",
                        message: "Failed to fetch product details"
                    });
                    console.error(error);
                    setLoading(false);
                    return;
                }

                setProductDetails(data);
            } catch (error) {
                console.log(error);
                setToast(({
                    type: "error",
                    message: "Failed to fetch product details"
                }));
            } finally {
                setLoading(false);
            }
        }

        fecthProductDetails();
    }, [productId]);

    const handleCloseProductDescription = () => {
        const pathname = window.location.pathname;
        const pathWithoutSearchParams = pathname.split("?")[0]

        navigate(pathWithoutSearchParams);
    }

    return (
        <div id="product-details-modal" className="h-screen w-full z-50 fixed top-0 left-0">
            {toast && (
                <Toast 
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            <div 
                id="backdrop" 
                className="absolute top-0 left-0 w-full cursor-pointer h-screen backdrop-brightness-[.4]"
                onClick={handleCloseProductDescription}
            ></div>

            <div 
                id="product-details-container" 
                className="rounded-t-4xl overflow-y-scroll flex flex-col gap-4 sm:gap-8 lg:flex-row p-8 lg:p-16 relative top-[10%] h-[90%] bg-white xl:p-24 xl:py-16"
            >
                <button onClick={handleCloseProductDescription} id="close-modal" className="absolute hidden lg:block top-5 cursor-pointer right-5 p-2 rounded-full font-bold text-gray-500 bg-gray-200">
                    {/* X-icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                {loading ? (
                    <div className="flex items-center justify-center gap-2 h-full w-full">
                        <InlineSpinner />
                        <div>Loading product details ...</div>
                    </div>
                ): (
                    <>
                        <div 
                            className="
                                w-full overflow-hidden min-h-[400px] min-w-[300px] lg:min-w-[450px] lg:w-[450px] 
                                xl:min-w-[600px] h-full rounded-4xl bg-gray-200 relative
                            "
                        >
                            <span 
                                className={`
                                    ${productDetails?.status === "active"? "bg-green-100 text-green-500 border border-green-500": "bg-red-100 text-red-500 border border-red-500"} 
                                    absolute top-5 right-5 rounded-md text-sm p-2 z-10
                                `}
                            >
                                {productDetails?.status === "active"? "Available": "Unavailable"}
                            </span>
                            <img src={productDetails?.image_url} className="h-full w-full object-cover rounded-4xl" />
                        </div>

                        <div id="product-details" className="p-4 lg:py-24 space-y-6 lg:space-y-8 lg:p-8">
                            <h1 className="leading-[40px] text-4xl text-gray-900 font-extrabold">{productDetails?.name}</h1>
                            <p id="product-description" className="leading-loose text-justify sm:leading-[38px] font-headings">{productDetails?.description}</p>
                            <div id="price-buy" className="flex flex-col sm:flex-row gap-4 w-full justify-between">
                                <h1 className="font-bold sm:text-4xl text-gray-600">{!isWide? "Price:": ""} {formatToNaira(productDetails?.price)}</h1>
                                <Button type="bg-black" className="py-2 w-full text-white bg-gray-600">Buy Now</Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductsDetails;
