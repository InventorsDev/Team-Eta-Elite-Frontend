import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { formatToNaira } from "../../../../utils/helpers/formatToNaira";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "../../../../utils/hooks/useWindowSize";
import Table from "../../../../components/Table/Table";
import Button from "../../../../components/Button/Button";
import Toast from "../../../../components/Toast/Toast";
import Skeleton from "../../../../components/Skeleton/Skeleton";
import EmptyListUI from "../../../../components/EmptyListUI/EmptyListUI";
import Modal from "../../../../components/Modal/Modal";
import InlineSpinner from "../../../../components/InlineSpinner/InlineSpinner";

const Products = () => {
    const [productsList, setProductsList] = useState([]);
    const [showDeletionModal, setShowDeletionModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedProductName, setSelectedProductName] = useState("");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();
    const isWide = useWindowSize();

    useEffect(() => {
        const controller = new AbortController();
        fetchVendorProducts();
        () => controller.abort();
    }, []);

    const fetchVendorProducts = async () => {
        setLoading(true);

        // get user id 
        const { data: claims } = await supabase.auth.getClaims();
        const vendorId = claims.claims.sub;

        const { data: Products, error } = await supabase
            .from('Products')
            .select('*')
            .eq("vendor_id", vendorId);
        
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

    const handleProductDeletion = async () => {
        setDeleteLoading(true);
        const selectedProduct = productsList.find(product => product.name === selectedProductName);

        const { error } = await supabase
            .from("Products")
            .delete()
            .eq("id", selectedProduct.id);

        if (error) {
            setToast({
                type: "error",
                message: "Failed to delete selected product."
            });
            console.log(error);
            setDeleteLoading(false);
            return;
        }

        // remove product from UI
        const updatedProductsList = [...productsList].filter(product => product.id !== selectedProduct.id);
        setProductsList(updatedProductsList);

        // apply success states
        setToast({
            type: "success",
            message: "Product deleted successfully."
        });
        setDeleteLoading(false);
        setShowDeletionModal(false);
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

            {showDeletionModal && (
                <Modal type={"blur"}>
                    <h1 className="text-lg font-semibold">Confirm the deletion of <b className="font-extrabold">{selectedProductName}</b></h1>
                    <p className="text-sm">Are you sure you want to delete the selected product? <br /> This action cannot be undone.</p>
                    <div className="flex items-center gap-4" id="buttons-container">
                        <Button 
                            onClick={() => setShowDeletionModal(false)}
                            className={"bg-neutral-600 py-2 px-4 text-white border-2 border-neutral-300 hover:bg-neutral-700"}
                        >
                            Cancel
                        </Button>
                        <Button 
                            disabled={deleteLoading}
                            className={"text-white py-2 px-4 bg-red-500 border-2 border-red-700 hover:bg-red-700"}
                            onClick={handleProductDeletion}
                        >
                            {deleteLoading
                                ? (<span>
                                    <InlineSpinner className="px-2" /> Deleting ...
                                  </span>)
                                :"Delete"
                            }
                        </Button>
                    </div>
                </Modal>
            )}

            <header className="flex justify-between items-center gap-2">
                <div className="space-y-1">
                    <h1 className="font-bold text-2xl">My Products</h1>
                    <p className="text-gray-500 text-sm">Here's a list of your products</p>
                </div>
                <Button type={"bg-black"} onClick={() => navigate("/dashboard/vendor/create")}>
                    {isWide ? "+ Upload New Product": "+ Upload"}
                </Button>
            </header>

            {productsList.length === 0 && !loading && (
                <EmptyListUI 
                    heading={"Oops, There are No Products Currently."}
                    subheading={"Upload products to see them here"}
                />
            )}

            <Table headers={["Product", "Title", "Price", "Status", "Actions"]}>
                {productsList.length > 0 && !loading && productsList.map(item => (
                    <tr key={item.id} className="border-t-2 border-gray-200 text-gray-600">
                        <td className="p-4">
                            <img 
                                src={item.image_url}
                                className="w-[76px] h-[70px] rounded-xl object-cover"
                                alt="Product Image"
                            />
                        </td>
                        <td className="p-4">{item.name}</td>
                        <td className="p-4">{formatToNaira(item.price)}</td>
                        <td className="p-4">
                            {item.status === "active" ? (
                                <span className="text-green-500 p-2 rounded-xl bg-green-100 text-sm">Active</span>
                            ) : (
                                <span className="text-red-500 p-2 rounded-xl bg-red-100 text-sm">Inactive</span>
                            )}
                        </td>
                        <td className="p-4">
                            <div className="flex items-center gap-2">
                                {/* Edit Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>

                                {/* Delete Icon */}
                                <svg 
                                    onClick={() => { 
                                        setSelectedProductName(item.name); 
                                        setShowDeletionModal(true);
                                    }}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" 
                                    className="size-5 cursor-pointer"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </div>
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

export default Products;
