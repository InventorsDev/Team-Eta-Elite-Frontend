import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../lib/supabase";
import { formatToNaira } from "../../../../utils/helpers/formatToNaira";
import { formatDateTime } from "../../../../utils/helpers/formatDateTime";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";
import { useAuth } from "../../../../utils/hooks/useAuth";
import Table from "../../../../components/Table/Table";
import Toast from "../../../../components/Toast/Toast";
import EmptyListUI from "../../../../components/EmptyListUI/EmptyListUI";
import Skeleton from "../../../../components/Skeleton/Skeleton";
import Button from "../../../../components/Button/Button";
import Modal from "../../../../components/Modal/Modal";
import InlineSpinner from "../../../../components/InlineSpinner/InlineSpinner";

const Orders = () => {
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [showDeliveryConfirmationModal, setShowDeliveryConfirmationModal] = useState(false);
    const [loadingFundsRelease, setLoadingFundsRelease] = useState({ state: false, id: "" });
    const [selectedOrder, setSelectedOrder] = useState({
        id: "",
        product_name: "",
        buyer_email: "",
    });
    const [code, setCode] = useState(["", "", "", ""]);
    const [loadingCodeSubmission, setLoadingCodeSubmission] = useState(false);
    const inputRefs = useRef([]);
    const isWide = useWindowSize();
    const [sortOrder, setSortOrder] = useState("least");
    const { sessionUserData } = useAuth();

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

        handleDeliveryConfirmation(selectedOrder.id, finalCode);
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

    const handleDeliveryConfirmation = async (order_id, inputCode) => {
        setLoadingCodeSubmission(true);
        try {
            const response = await fetch("/api/confirm-delivery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ order_id, inputCode })
            });
            
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to confirm delivery");
            }
            setToast({ type: "success", message: "Delivery confirmed successfully! You would receive your funds on the next work day." });
            // refresh orders list
            fetchOrders();
            setShowDeliveryConfirmationModal(false);
        } catch (error) {
            setToast({ type: "error", message: error.message || "Failed to confirm delivery" });
        } finally {
            setLoadingCodeSubmission(false);
            setCode(["", "", "", ""]);
        }
    };

    // least and most recent orders logic
    const sortedOrders = [...ordersList].sort((a, b) => {
        if (sortOrder === "most") {
            return new Date(b.created_at) - new Date(a.created_at); // newest first
        } else {
            return new Date(a.created_at) - new Date(b.created_at); // oldest first
        }
    });     

    const isCreatedMoreThanOneDayAgo = (createdAt) => {
        if (!createdAt) return false;
        const created = new Date(createdAt);
        if (isNaN(created.getTime())) return false; 
        const msInDay = 24 * 60 * 60 * 1000;
        return (Date.now() - created.getTime()) > msInDay;
    };

    const handleFundsRelease = async (order) => {
        if (!isCreatedMoreThanOneDayAgo(order.created_at)) {
            setToast({
                type: "error",
                message: "Paystack releases funds on the next working day after a transaction"
            });
            return;
        } 

        // handle funds release
        const test_account = {
            accountNumber: "0000000000",
            accountName: "Zenith Bank", 
            bankCode: "057", 
        }

        const actual_receipient = {
            accountNumber: sessionUserData.account_number,
            accountName: sessionUserData.account_name, 
            bankCode: sessionUserData.sort_code, 
        }

        const payload = { 
            amount: order.amount_paid * 100, // convert to kobo
            reason: `Purchase of item: ${order.product_name}`,
            ...actual_receipient
        }        

        setLoadingFundsRelease({ state: true, id: order.id });

        try {
            const response = await fetch("/api/paystack-transfer", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error(error);
                setToast({
                    type: "error",
                    message: "Failed to withdraw funds - try again - or contact support"
                });
                return;
            }
            
            const data = response.json();
            
            setToast({
                type: "success",
                message: "Funds have been successfully transfered to your account."
            });

            // update escrow_status to "released" in orders table
            const { data: updatedOrder, error: updateError } = await supabase
                .from("orders")
                .update({ escrow_status: "released" })
                .eq("id", order.id)
                .select()
                .single();

            if (updateError) {
                setToast({ type: "error", message: updateError.message || "Failed to update order status" });
            } else {
                fetchOrders();
            }

            console.log(data);
        } catch (error) {
            console.error(error);
            setToast({
                type: "error",
                message: "Failed to withdraw funds - try again - or contact support"
            });
            return;
        } finally {
            setLoadingFundsRelease({ state: false, id: order.id })
        }
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

            {loadingFundsRelease.state && (
                <Modal type="blur">
                    <h1 className="sm:text-lg font-semibold">
                        Loading Payment for Order ID: <span className="font-bold">{loadingFundsRelease.id}</span>
                    </h1>
                    <InlineSpinner size="lg" />
                </Modal>
            )}

            {showDeliveryConfirmationModal && (
                <Modal type={"blur"}>
                    <h1 className="sm:text-lg font-semibold">
                        Confirm the delivery code of <b className="font-extrabold">{selectedOrder.product_name} </b> 
                        ordered by <b className="font-extrabold">{selectedOrder.buyer_email}</b>
                    </h1>
                    <p className="text-sm">
                        Get code from your customer and confirm delivery.
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

            <header className="flex mt-2 md:mt-0 justify-between items-center gap-2">
                <div className="space-y-1">
                    <h1 className="font-bold text-lg md:text-2xl">My Orders</h1>
                    <p className="text-gray-500 text-sm">Here's a list of product requests</p>
                </div>

                {/* SELECT ORDER  */}
                <div className="">
                    <select 
                        className="py-2 px-2 flex gap-1 cursor-pointer font-semibold border-2 text-gray-800 outline-0 border-gray-300 rounded-lg " 
                        id="order-sort"
                        value={sortOrder}
                        onChange={(e)=> setSortOrder(e.target.value)}
                    >
                        <option value="least">Least Recent</option>
                        <option value="most">Most Recent</option>
                    </select>
                </div>

            </header>

            {sortedOrders.length === 0 && !loading && (
                <EmptyListUI 
                    heading={"Oops, No Orders Made Yet 😢"}
                    subheading={"Refresh to see updated list."}
                    forOrdersPage={true}
                /> 
            )}

            <Table headers={["Date", "Buyer", "Product", "Amount", "Delivery Status", "Escrow Status", "Actions"]}>
                {sortedOrders.length > 0 && !loading && sortedOrders.map(order => (
                    <tr key={order.id} className="border-t-2 border-gray-200 text-gray-600">
                        <td className="p-4">{formatDateTime(order.created_at).date}</td>
                        <td className="p-4">{order.buyer_email}</td>
                        <td className="p-4">{order.product_name}</td>
                        <td className="p-4">{formatToNaira(order.amount_paid)}</td>
                        <td className="p-4">
                            {order.delivery_status === "pending" ? (
                                <span className="text-yellow-500 p-2 rounded-xl bg-yellow-100 text-sm">Pending</span>
                            ) : (
                                <span className="text-green-500 p-2 rounded-xl bg-green-100 text-sm">Delivered</span>
                            )}
                        </td>
                        <td className="p-4">
                            {order.escrow_status === "held" ? (
                                <span className="text-yellow-500 p-2 rounded-xl bg-yellow-100 text-sm">Held</span>
                            ) : (
                                <span className="text-green-500 p-2 rounded-xl bg-green-100 text-sm">Released</span>
                            )}
                        </td>
                        {/* <td className="p-4">
                            {order.dispute ? (
                                <span className="text-red-500 p-2 rounded-xl bg-red-100 text-sm">Disputed</span>
                            ) : (
                                <span className="text-green-500 p-2 rounded-xl bg-green-100 text-sm">None</span>
                            )}
                        </td> */}
                        <td className="p-4 flex gap-2 justify-center flex-col">
                            {order.delivery_status === "delivered" ? (
                                <Button 
                                    type="bg-black"
                                    onClick={() => handleFundsRelease(order)}
                                    disabled={order.escrow_status !== "held"}
                                    className="
                                        flex gap-2 w-full px-8 items-center py-2 cursor-pointer self-center border rounded bg-gray-700 hover:text-white 
                                        ease-transition disabled:opacity-50 disabled:cursor-not-allowed group
                                    "
                                >
                                    <img src="/icons/payouts/withdraw.svg" className="size-6" />
                                    <p>
                                        {order.status === "released" 
                                            ? "Released!"
                                            : (isWide? "Withdraw Funds": "Withdraw")
                                        }</p>
                                </Button>
                            ): (
                                <Button 
                                    onClick={() => handleShowConfirmDeliveryModal(order)}
                                    className="
                                        px-2 py-2 cursor-pointer self-center border rounded hover:bg-gray-700 hover:text-white ease-transition disabled:opacity-50 
                                        disabled:cursor-not-allowed
                                    "
                                >
                                    {isWide? "Confirm Delivery": "Confirm"}
                                </Button>
                            )}
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
