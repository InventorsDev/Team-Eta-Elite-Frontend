import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../lib/supabase";
import Table from "../../../../components/Table/Table";
import Toast from "../../../../components/Toast/Toast";
import EmptyListUI from "../../../../components/EmptyListUI/EmptyListUI";
import Skeleton from "../../../../components/Skeleton/Skeleton";
import Button from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";
import InlineSpinner from "../../../../components/InlineSpinner/InlineSpinner";
import { formatToNaira } from "../../../../utils/helpers/formatToNaira";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";

const Orders = () => {
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [showDeliveryConfirmationModal, setShowDeliveryConfirmationModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({
        product_name: "",
        id: ""
    });
    const [code, setCode] = useState(["", "", "", ""]);
    const [loadingCodeSubmission, setLoadingCodeSubmission] = useState(false);
    const inputRefs = useRef([]);
    const isWide = useWindowSize();

    useEffect(() => {
        fetchOrders();
    }, []);
    
    const fetchOrders = async () => {
        setLoading(true);

        // get user id 
        const { data: claims } = await supabase.auth.getClaims();
        const vendorId = claims.claims.sub;

        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq("vendor_id", vendorId);
        
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

    const handleChange = (e, index) => {
        const value = e.target.value;

        // Only allow digits
        if (!/^[0-9]?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // move to next input
        if (value && index < 3) {
          inputRefs.current[index + 1].focus();
        }
    };

    // Handle backspace to move focus back
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoadingCodeSubmission(true);
        const finalCode = code.join("");
        console.log("Submitted code:", finalCode);
        setTimeout(() => setLoadingCodeSubmission(false), 2000);
    };

    const handleShowConfirmDeliveryModal = (order) => {
        setShowDeliveryConfirmationModal(true);
        setSelectedOrder(order);
        setTimeout(() => { 
            if (inputRefs.current[0].value === "") {
                inputRefs.current[0].focus();
            } else {
                inputRefs.current[3].focus();
            }
        }, 200);
    }

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
                    <h1 className="text-lg font-semibold">
                        Confirm the delivery code of <b className="font-extrabold">{selectedOrder.product_name}</b>
                    </h1>
                    <p className="text-sm">
                        Get code from your customer and confirm before handing goods out.
                    </p>
                    <div className="mt-4 flex flex-col gap-4">
                        <div className="flex justify-center gap-2">
                            {code.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="w-12 h-12 text-center text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            ))}
                        </div>

                        <div className="flex mx-4 items-center gap-4" id="buttons-container">
                            <Button 
                                type="button"
                                onClick={(e) => { 
                                    e.preventDefault();
                                    setShowDeliveryConfirmationModal(false);
                                }}
                                className={"bg-neutral-600 py-2 px-4 text-white border-2 border-neutral-300 hover:bg-neutral-700"}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleSubmit}
                                disabled={loadingCodeSubmission}
                                className={"text-white py-2 px-4 bg-blue-500 border-2 border-blue-700 hover:bg-blue-700"}
                                type="submit"
                            >
                                {loadingCodeSubmission
                                    ? (<span>
                                        <InlineSpinner className="px-2" /> Submitting ...
                                    </span>)
                                    : "Submit"
                                }
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            <header className="flex mt-10 md:mt-0 justify-between items-center gap-2">
                <div className="space-y-1">
                    <h1 className="font-bold text-2xl">My Orders</h1>
                    <p className="text-gray-500 text-sm">Here's a list of product requests</p>
                </div>
            </header>

            {ordersList.length === 0 && !loading && (
                <EmptyListUI 
                    heading={"Oops, No Orders Made Yet 😢"}
                    subheading={"Refresh to see updated list."}
                    forOrdersPage={true}
                /> 
            )}

            <Table headers={["Buyer", "Product", "Amount", "Delivery Status", "Escrow Status", "Disputed?", "Actions"]}>
                {ordersList.length > 0 && !loading && ordersList.map(order => (
                    <tr key={order.id} className="border-t-2 border-gray-200 text-gray-600">
                        <td className="p-4">{order.buyer_email}</td>
                        <td className="p-4">{order.product_name}</td>
                        <td className="p-4">{formatToNaira(order.amount_paid)}</td>
                        <td className="p-4">
                            {order.delivery_status === "paid" ? (
                                <span className="text-green-500 p-2 rounded-xl bg-green-100 text-sm">Paid</span>
                            ) : (
                                <span className="text-blue-500 p-2 rounded-xl bg-blue-100 text-sm">Delivered</span>
                            )}
                        </td>
                        <td className="p-4">
                            {order.escrow_status === "held" ? (
                                <span className="text-yellow-500 p-2 rounded-xl bg-yellow-100 text-sm">Held</span>
                            ) : (
                                <span className="text-green-500 p-2 rounded-xl bg-green-100 text-sm">Delivered</span>
                            )}
                        </td>
                        <td className="p-4">
                            {order.dispute ? (
                                <span className="text-red-500 p-2 rounded-xl bg-red-100 text-sm">Disputed</span>
                            ) : (
                                <span className="text-green-500 p-2 rounded-xl bg-green-100 text-sm">None</span>
                            )}
                        </td>
                        <td className="p-4 flex gap-2 flex-col">
                            <Button 
                                onClick={() => handleShowConfirmDeliveryModal(order)}
                                className="px-2 py-2 cursor-pointer border rounded hover:bg-gray-700 hover:text-white ease-transition"
                            >
                                {isWide? "Confirm Delivery": "Confirm"}
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
