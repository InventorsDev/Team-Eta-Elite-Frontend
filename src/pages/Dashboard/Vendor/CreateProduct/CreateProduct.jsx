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

        if (!formData.description.trim()) {
            setToast({ 
                type: "error",
                message: "Product description is required"
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
        <div id="CreateProductPage">
            {toast && (
                <Toast 
                    type={toast?.type}
                    message={toast?.message}
                    onClose={() => setToast(null)}
                />
            )}
            <h1>Create Product</h1>
            <p>Fill out the form below to add a new product</p>

            <form onSubmit={handleFormSubmission} className="space-y-2">
                <div id="name-input">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" className="border" onChange={handleFormChange} placeholder="e.g Comfy shorts" />
                </div>
                <div id="description-input">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" id="description" className="border" onChange={handleFormChange} placeholder="Provide a detailed description of your product" />
                </div>
                <div id="price-input">
                    <label htmlFor="price">Price</label>
                    <input 
                        type="text" 
                        id="price" 
                        className="border" 
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

                <div id="image-input">
                    <label htmlFor="image">Image Upload (Max 5MB)</label>
                    <ImageUpload 
                        ref={imageUploadRef}
                        onSelect={handleImageSelect}
                        onError={handleImageError}
                        maxFileSize={MAX_FILE_SIZE}
                    />
                </div>

                <Button 
                    disabled={isLoading} 
                    type="bg-black"
                >
                    {isLoading ? (
                        <div className="gap-2 justify-center flex items-center">
                            <InlineSpinner />
                            Uploading Product...
                        </div>
                    ) : (
                        'Upload Product'
                    )}
                </Button>
            </form>
        </div>
    );
}

export default CreateProduct;
