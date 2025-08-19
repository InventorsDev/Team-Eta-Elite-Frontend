import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import Table from "../../../../components/Table/Table";
import Toast from "../../../../components/Toast/Toast";
import EmptyListUI from "../../../../components/EmptyListUI/EmptyListUI";
import Skeleton from "../../../../components/Skeleton/Skeleton";
import { formatToNaira } from "../../../../utils/helpers/formatToNaira";

const Orders = () => {
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

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

        console.log(orders);

        setOrdersList(orders);
        setTimeout(() =>  setLoading(false), 1000);
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

            <header className="flex justify-between items-center gap-2">
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
                            <button className="p-2 cursor-pointer border rounded hover:bg-gray-700 hover:text-white ease-transition">
                                Confirm Delivery
                            </button>
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
