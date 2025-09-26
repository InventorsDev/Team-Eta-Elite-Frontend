import { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatToNaira } from "../../utils/helpers/formatToNaira";
import { supabase } from "../../lib/supabase";
import { useWindowSize } from "../../utils/hooks/useWindowSize";
import { useAuth } from "../../utils/hooks/useAuth";
import { Player } from "@lottiefiles/react-lottie-player";
import { PaystackButton } from "react-paystack";
import Button from "../Button/Button";
import InlineSpinner from "../InlineSpinner/InlineSpinner";
import Toast from "../Toast/Toast";
import Modal from "../Modal/Modal";
import { corsHeaders } from "../../utils/cors";

const ProductsDetails = ({ productId, vendorName, vendorId }) => {
    const [loading, setLoading] = useState(false);
    const [productDetails, setProductDetails] = useState(null)
    const [toast, setToast] = useState(null);
    const [showOrderCreationModal, setShowOrderCreationModal] = useState(false);
    const [orderCreationLoading, setOrderCreationLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState({ state: false, message: "" });
    const { isAuthenticated, sessionUserData } = useAuth();
    const isWide = useWindowSize();
    const navigate = useNavigate();

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: sessionUserData.email,  
        amount: (productDetails?.price * 100) || 0, // in prod, we would add payment charges
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        text: 'Paystack Payment Button',
        onSuccess: (reference) => handlePaystackPaymentSuccess(reference),
        onClose: () => handlePaystackPaymentFailure(),
    }

    useLayoutEffect(() => {        
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

    const handlePurchase = () => {
        if (!isAuthenticated) {
            setToast({ 
                type: "neutral",
                message: "Oops, You need to login to protect and track your purchase"
            });

            setTimeout(() => {
                const pathname = window.location.pathname;
                const searchParams = window.location.search;
                navigate(`/login?redirect_to=${pathname}${searchParams}`);
            }, 5000);

            return;
        }

        // Prevent vendors from purchasing with the Vendor account
        if (sessionUserData.sub === vendorId || sessionUserData.role === "vendor") {
            setToast({ 
                type: "error",
                message: "Purchases are not allowed for vendor accounts"
            });
            return;
        }

        // make sure users have put in their bank details on the dashboard (there should be a refund button on buyer's dashbaord)

        // click actual paystack payment button
        const paystackButton = document.querySelector(".paystack-button");
        paystackButton.click();
    }

    const handlePaystackPaymentSuccess = async (referenceObject) => {
        setToast({ 
            type: "success",
            message: "Payment successful with reference " + referenceObject.reference
        });

        setShowOrderCreationModal(true);
        createOrder(
            referenceObject.reference, 
            sessionUserData.sub, 
            vendorId, 
            sessionUserData.email, 
            productId, 
            productDetails.price
        );
    }

    const handlePaystackPaymentFailure = () => {
        setToast({ 
            type: "error",
            message: "Oops, Payment Failed."
        });
    };

    async function createOrder(transaction_reference, buyer_id, vendor_id, buyer_email, product_id, amount) {
        const orderData = { 
            transaction_reference: transaction_reference, 
            vendor_name: vendorName,
            product_name: productDetails?.name,
            buyer_id: buyer_id, 
            vendor_id: vendor_id, 
            buyer_email: buyer_email, 
            product_id: product_id, 
            amount: amount 
        }
        setOrderCreationLoading(true);

        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        try {
            const res = await fetch(
                `/api/create-order`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        ...corsHeaders
                    },
                    body: JSON.stringify(orderData),
                }
            );
    
            if (!res.ok) {
                console.error(res);
                setOrderSuccess({ state: false, message: "Failed to Create Order" });
                throw new Error("Failed to create order");
            }
    
            const data = res.json();
            console.log(data);
            
            setOrderSuccess({ state: true, message: `Congratulations, your order was placed successfully! 🥳` })
        } catch (error) {
            console.error(error);
            setOrderSuccess({ state: false, message: "Failed to Create Order" });
        } finally {
            setOrderCreationLoading(false);
        }
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

            {showOrderCreationModal && (
                <Modal type={"blur"}>
                    {/* Loading Modal UI */}
                    {orderCreationLoading && (
                        <div id="loading-ui" className="flex flex-col gap-6 items-center">
                            <InlineSpinner size="lg" />
                            <h1 className="font-bold text-xl ">Please Wait, Your Order is Being Created</h1>
                            <p className="text-red-500 text-xs flex gap-2 items-center font-semibold sm:text-sm">
                                {/* caution icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path 
                                        strokeLinecap="round" strokeLinejoin="round" 
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" 
                                    />
                                </svg>
                                Do not interrupt this process.
                            </p>
                        </div>
                    )}

                    {/* Success modal UI */}
                    {orderSuccess.state && !orderCreationLoading && (
                        <div className="space-y-6">
                            <Player
                                autoplay
                                loop={true}
                                src={"/lotties/order-animation.json"}
                                style={{ height: '150px', width: '150px', scale: "130%" }}
                            />
                            <h1 className="text-lg sm:text-3xl font-bold font-headings">
                                Congratulations, your order was placed successfully! 🥳
                            </h1>
                            <p className="text-sm sm:text-base">Your delivery code is on your dashboard</p>
                            <Button type="bg-black" onClick={() => navigate("/dashboard")}>
                                Go to Dashboard
                            </Button>
                        </div>
                    )}

                    {/* Error modal UI */}
                    {!orderSuccess.state && !orderCreationLoading && (
                        <div className="space-y-4">
                            <h1 className="text-red-500 font-bold text-xl">
                                {orderSuccess.message === ""? "Oops, Failed to Place Order": orderSuccess.message}
                            </h1>
                            <p className="text-sm">Please reach out to <b>omoniyiopemipo6@gmail.com</b></p>
                        </div>
                    )}
                </Modal>
            )}

            <div 
                id="backdrop" 
                className="absolute top-0 left-0 w-full cursor-pointer h-screen backdrop-brightness-[.4]"
                onClick={handleCloseProductDescription}
            ></div>

            <div 
                id="product-details-container" 
                className={`
                    rounded-t-4xl overflow-y-scroll flex flex-col gap-4 sm:gap-8 
                    lg:flex-row p-8 lg:p-16 relative top-[10%] h-[90%] bg-white xl:p-24 xl:py-16
                `}
            >
                <button 
                    onClick={handleCloseProductDescription} id="close-modal" 
                    className="absolute hidden lg:block top-5 cursor-pointer right-5 p-2 rounded-full font-bold text-gray-500 bg-gray-200"
                >
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

                        <div id="product-details" className="p-4 xl:py-0 space-y-6 lg:space-y-8 xl:p-8">
                            <h1 className="leading-[40px] text-4xl text-gray-900 font-extrabold">{productDetails?.name}</h1>
                            <p id="product-description" className="leading-loose text-justify sm:leading-[38px] font-headings">{productDetails?.description}</p>
                            <p><b>Vendor Name:</b>  {vendorName}</p>
                            <p><b>Expected delivery:</b>  5 - 7 days</p>
                            <div id="price-buy" className="flex flex-col sm:flex-row gap-4 w-full justify-between">
                                <h1 className="font-bold sm:text-4xl text-gray-600">{!isWide? "Price:": ""} {formatToNaira(productDetails?.price)}</h1>
                                <Button 
                                    disabled={productDetails?.status !== "active"}
                                    type="bg-black" 
                                    className="py-2 w-full text-white bg-gray-600"
                                    onClick={handlePurchase}
                                >
                                    Buy Now
                                </Button>

                                {/* actual hidden paystack payment button */}
                                <PaystackButton className="paystack-button hidden" {...paystackConfig} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductsDetails;
