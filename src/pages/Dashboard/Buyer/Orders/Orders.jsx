import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import Table from "../../../../components/Table/Table";
import Toast from "../../../../components/Toast/Toast";
import EmptyListUI from "../../../../components/EmptyListUI/EmptyListUI";
import Skeleton from "../../../../components/Skeleton/Skeleton";
import Button from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";
import { formatToNaira } from "../../../../utils/helpers/formatToNaira";
import { formatDateTime } from "../../../../utils/helpers/formatDateTime";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";

const Orders = () => {
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDeliveryCode, setLoadingDeliveryCode] = useState(false);
    const [toast, setToast] = useState(null);
    const [showDeliveryConfirmationModal, setShowDeliveryConfirmationModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({
        product_name: "",
        id: ""
    });
    const [deliveryCode, setDeliveryCode] = useState("");
    const isWide = useWindowSize();
    const [sortOrder, setSortOrder] = useState("least");


    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        setLoadingDeliveryCode(true);
        const fetchDeliveryCode = async () => {
            const { data, error } = await supabase
                .from("order_codes")
                .select("raw_code")
                .eq("order_id", selectedOrder.id)
                .single();
            if (error) {
                setToast({
                    type: "error",
                    message: error.message || "Failed to Fetch Delivery Code"
                });
                setLoadingDeliveryCode(false);
                throw new Error(error);
            } else {   
                setDeliveryCode(data.raw_code);
                setLoadingDeliveryCode(false);
            }
        }

        if (selectedOrder.id) {
            fetchDeliveryCode();
        }
        
    }, [selectedOrder.id])
    
    const fetchOrders = async () => {
        setLoading(true);

        // get user id 
        const { data: claims } = await supabase.auth.getClaims();
        const buyerId = claims.claims.sub;

        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq("buyer_id", buyerId);
        
        if (error) {
            setToast({
                type: "error",
                message: error.message || "Failed to Fetch Orders"
            })
            throw new Error(error);
        }

        setOrdersList(orders);
        setTimeout(() =>  setLoading(false), 1000);
    }

    const handleShowConfirmDeliveryModal = (order) => {
        setShowDeliveryConfirmationModal(true);
        setSelectedOrder(order);
    }

    // least and most recent orders logic
    const sortedOrders = [...ordersList].sort((a, b) => {
        if (sortOrder === "most") {
            return new Date(b.created_at) - new Date(a.created_at); // newest first
        } else {
            return new Date(a.created_at) - new Date(b.created_at); // oldest first
        }
    }); 

    return (
        <div className="w-full space-y-6">
            {toast && (
                <Toast 
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {showDeliveryConfirmationModal && (
                <Modal type={"blur"}>
                    {/* x-mark to close modal */}
                    <div 
                        onClick={() => setShowDeliveryConfirmationModal(false)}
                        className="p-1 sm:p-2 absolute top-2 right-2 rounded-full bg-gray-200 cursor-pointer text-black font-semibold active:scale-[95%]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 sm:size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </div>

                    <h1 className="text-lg font-semibold">
                        Confirm product delivery of <b className="font-extrabold">{selectedOrder.product_name}</b>
                    </h1>
                    <h1 className="text-4xl sm:text-8xl text-neutral-700 tracking-widest font-bold">
                        {/* show 4 digit placeholder skeletons with pulse animation while loading delivery code */}
                        {loadingDeliveryCode ? (
                            <div className="flex gap-4">
                                {[...Array(4).keys()].map(index => (
                                    <div 
                                        key={index} 
                                        className="w-16 h-24 bg-gray-300 rounded-lg animate-pulse"
                                    ></div>
                                ))}
                            </div>
                        ) : (
                            // show actual delivery code
                            deliveryCode 
                        )}
                    </h1>
                    <p className="flex gap-2 text-xs sm:text-sm text-yellow-600 font-semibold">
                        {/* caution icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="hidden sm:inline size-5">
                            <path 
                                strokeLinecap="round" strokeLinejoin="round" 
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" 
                            />
                        </svg>
                        Only share this code with the vendor if goods are in good conditions.
                    </p>
                    <p className="text-red-500 font-semibold text-xs sm:text-sm">(By sharing this code, you confirm that goods are delivered)</p>
                </Modal>
            )}

            <header className="flex justify-between mt-2 md:mt-0 items-center gap-2">
                <div className="space-y-1">
                    <h1 className="font-bold text-lg sm:text-2xl">My Orders</h1>
                    <p className="text-gray-500 text-sm">Here's a list of products you've requested</p>
                </div>
                {/* slection of least and most recent orders */}
                <select 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="py-2 px-2 flex gap-1 cursor-pointer font-semibold border-2 text-gray-800 outline-0 border-gray-300 rounded-lg "
                >
                    <option value="least">Least Recent</option>
                    <option value="most">Most Recent</option>
                </select>
            </header>

            {sortedOrders.length === 0 && !loading && (
                <EmptyListUI 
                    heading={"Oops, No Orders Made Yet 😢"}
                    subheading={"Refresh to see updated list."}
                    forOrdersPage={true}
                /> 
            )}

            <Table headers={["Date", "Vendor's Name", "Product", "Price","Delivery Status", "Actions"]}>
                {sortedOrders.length > 0 && !loading && sortedOrders.map(order => (
                    <tr key={order.id} className="border-t-2 border-gray-200 text-gray-600">
                        <td className="p-4">{formatDateTime(order.created_at).date}</td>
                        <td className="p-4">{order.vendor_name}</td>
                        <td className="p-4">{order.product_name}</td>
                        <td className="p-4">{formatToNaira(order.amount_paid)}</td>
                        <td className="p-4">
                            {order.delivery_status === "pending" ? (
                                <span className="text-yellow-500 p-2 rounded-xl bg-yellow-100 text-sm">Pending</span>
                            ) : (
                                <span className="text-green-500 p-2 rounded-xl bg-green-100 text-sm">Delivered</span>
                            )}
                        </td>
                        <td className="p-4 flex gap-2 flex-col">
                            <Button 
                                onClick={() => handleShowConfirmDeliveryModal(order)}
                                className="px-2 py-2 cursor-pointer border rounded hover:bg-gray-700 hover:text-white ease-transition
                                disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={order.delivery_status === "delivered"}
                            >
                                {order.delivery_status === "delivered" ? "Delivery Confirmed!":(isWide? "Confirm Delivery": "Confirm")}
                            </Button>
                        </td>
                    </tr> 
                ))}
            </Table>

            {loading && (
                <div className="space-y-3">
                    {[...Array(10).keys()].map(index => index + 1).map(index => <Skeleton key={index} />)}
                </div>
            )}
        </div>
    );
}

export default Orders;
