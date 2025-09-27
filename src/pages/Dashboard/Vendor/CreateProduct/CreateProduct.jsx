import { useState, useRef } from "react";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../utils/hooks/useAuth";
import Button from "../../../../components/Button/Button";
import InlineSpinner from "../../../../components/InlineSpinner/InlineSpinner";
import Toast from "../../../../components/Toast/Toast";
import ImageUpload from "../../../../components/ImageUpload/ImageUpload";

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        fileUrl: ""
    });
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const { sessionUserData } = useAuth();
    const vendor_id = sessionUserData.sub;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
    const imageUploadRef = useRef();

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value}));
    }

    const handleImageSelect = (file) => {
        setImageFile(file);
    };

    const handleImageError = (errorMessage) => {
        setToast({
            type: "error",
            message: errorMessage
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setToast({ 
                type: "error",
                message: "Product name is required"
            });
            return false;
        }

        if (!formData.description.trim() ) {
            setToast({ 
                type: "error",
                message: "Product description is required"
            });
            return false;
        }

        if (formData.description.trim().split(" ").length < 30) {
            setToast({ 
                type: "error",
                message: "Your description must contain at least 30 words"
            });
            return false;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price < 500) {
            setToast({ 
                type: "error",
                message: "Price must be at least ₦500"
            });
            return false;
        }

        if (!imageFile) {
            setToast({ 
                type: "error",
                message: "Product image is required"
            });
            return false;
        }

        return true;
    };

    const uploadImage = async () => {
        if (!imageFile) return null;
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        try {
            const { error } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile);

            if (error) throw error;

            const { data: publicUrl } = supabase.storage
                .from('products')
                .getPublicUrl(fileName);

            return publicUrl.publicUrl;
        } catch (error) {
            setToast({ 
                type: "error",
                message: "Error uploading image",
            });
            return null;
        }
    }

    const handleFormSubmission = async (e) => {
        e.preventDefault();
        // Validate form before proceeding
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);

        try {
            // Upload image first
            const imageUrl = await uploadImage();
            
            if (!imageUrl && imageFile) {
                setIsLoading(false);
                return;
            }

            // Insert product data
            const { error } = await supabase
                .from('Products')
                .insert([{
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    image_url: imageUrl,
                    vendor_id: vendor_id
                }]);

            if (error) throw error;

            setToast({
                type: "success",
                message: 'Product created successfully!'
            });
            
            // Reset form
            setFormData({
                name: "",
                description: "",
                price: 0,
                fileUrl: ""
            });
            setImageFile(null);
            imageUploadRef.current?.clearPreview();
            e.target.reset();
        } catch (error) {
            setToast({ 
                type: "error",
                message: "Error creating product",
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div id="CreateProductPage" className="mt-2 md:mt-0">
            {toast && (
                <Toast 
                    type={toast?.type}
                    message={toast?.message}
                    onClose={() => setToast(null)}
                />
            )}
            <h1 className="text-2xl font-extrabold ">Add Product</h1>
            
            <p className="text-gray-500 text-sm">Fill out the form below to add a new product</p>

            <form onSubmit={handleFormSubmission} className="space-y-2 border-2 border-gray-200 p-5 rounded-lg mt-5 ">
                <div id="name-input" className="">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <input type="text" id="name" className="border-1 border-gray-400 rounded-md w-full px-3 py-2" onChange={handleFormChange} placeholder="e.g Comfy shorts" />
                </div>
                <div id="description-input">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea type="text" id="description" className="border-1 border-gray-400 rounded-md w-full px-3 py-2" onChange={handleFormChange} placeholder="Provide a detailed description of your product" />
                </div>
                <div id="price-input">
                    <label htmlFor="price" className="text-sm font-medium">Price</label>
                    <input 
                        type="text" 
                        id="price" 
                        className="border-1 border-gray-400 rounded-md w-full px-3 py-2 " 
                        value={formData.price === 0 ? "" : `₦${new Intl.NumberFormat('en-NG').format(formData.price)}`}
                        onChange={e => {
                            // Remove non-digit characters and parse to number
                            const rawValue = e.target.value.replace(/[^0-9]/g, "");
                            setFormData(prev => ({
                                ...prev,
                                price: rawValue === "" ? 0 : Number(rawValue)
                            }));
                        }}
                        placeholder="₦ 0.00" 
                    />
                </div>

                <div id="image-input" className="mt-4">
                    <label htmlFor="image" className="text-sm font-medium">Image Upload (Max 5MB)</label>
                    <ImageUpload 
                        ref={imageUploadRef}
                        onSelect={handleImageSelect}
                        onError={handleImageError}
                        maxFileSize={MAX_FILE_SIZE}
                    />
                </div>
            
            <div className="rounded-lg mt-8 mb-6 justify-center flex items-center">
                <Button className="w-64 py-2 rounded-md "
                    disabled={isLoading} 
                    type="bg-black"
                >
                    {isLoading ? (
                        <div>
                            <InlineSpinner />
                            Uploading Product...
                        </div>
                    ) : (
                        'Upload Product'
                    )}
                </Button>
            </div>    
            </form>
        </div>
    );
}

export default CreateProduct;
