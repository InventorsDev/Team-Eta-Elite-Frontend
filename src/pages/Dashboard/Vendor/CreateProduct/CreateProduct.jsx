import { useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../utils/hooks/useAuth";
import Button from "../../../../components/Button/Button";
import InlineSpinner from "../../../../components/InlineSpinner/InlineSpinner";
import Toast from "../../../../components/Toast/Toast";

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

    const handleFormChange = (e) => {
        const { id, value, files } = e.target;
        
        if (id === "image") {
            setImageFile(files[0]);
        } else {
            setFormData(prev => ({...prev, [id]: value}));
        }
    }

    const uploadImage = async () => {
        if (!imageFile) return null;
        
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;

        try {
            const { data, error } = await supabase.storage
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
                    <input type="text" id="name" onChange={handleFormChange} placeholder="e.g Comfy shorts" />
                </div>
                <div id="description-input">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" id="description" onChange={handleFormChange} placeholder="Provide a detailed description of your product" />
                </div>
                <div id="price-input">
                    <label htmlFor="price">Price</label>
                    <input type="text" id="price" onChange={handleFormChange} placeholder="₦ 0.00" />
                </div>                
                <div id="image-input">
                    <label htmlFor="image">Image Upload</label>
                    <input type="file" name="image" onChange={handleFormChange}  id="image" />
                </div>

                <Button 
                    disabled={isLoading} 
                    type="bg-black"
                >
                    {isLoading ? (
                        <div className="gap-2 flex items-center">
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
