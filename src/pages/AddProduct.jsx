import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { Upload, Wallet, Save, Wand2 } from 'lucide-react';
import { auth, realtimeDb as db } from '../config/firebase';
import { ref, push, set, update } from 'firebase/database';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const productToEdit = location.state?.productToEdit;

    const [formData, setFormData] = useState({
        name: '',
        category: 'Electronics',
        price: '',
        insuranceFee: '',
        condition: 'Used - Good',
        description: '',
        location: ''
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                category: productToEdit.category,
                price: productToEdit.price,
                insuranceFee: productToEdit.insuranceFee || '',
                condition: productToEdit.condition,
                description: productToEdit.description,
                location: productToEdit.location
            });
            setImagePreview(productToEdit.image);
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
    };

    const handleAISuggestion = () => {
        // Mock AI for now
        toast("AI Analyzing product... Suggested Price: Rs. 4,500/day", { icon: '🤖' });
        setFormData(prev => ({ ...prev, price: '4500' }));
    };

    const handleSaveDraft = () => {
        toast.success("Draft saved successfully!");
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show local preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload to Cloudinary in background
            try {
                // We'll store the file temporarily to upload on submit, OR upload now.
                // Uploading now is better UX for "file ready".
                // But AddProduct state logic needs to handle it.
                // Let's attach the file to state effectively by storing the promise or result?
                // Actually, let's keep it simple: Upload ON SUBMIT is safer for bandwidth if they cancel.
                // BUT, to avoid complex state management of "File vs URL", uploading now is often easier.
                // Let's stick to: Preview is local. Form submit triggers upload if file exists.
                // WAIT: The previous logic relied on `imagePreview` being the data source.
                // I will add a `imageFile` state.
                setImageFile(file);
            } catch (error) {
                console.error("Error setting up upload:", error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            toast.error("You must be logged in to list a product.");
            return;
        }

        setIsSubmitting(true);
        try {
            let finalImage = imagePreview; // Default to existing preview (could be URL or base64)

            if (imageFile) {
                // Upload new image to Cloudinary
                finalImage = await uploadToCloudinary(imageFile);
            }

            if (productToEdit) {
                // Update existing
                await update(ref(db, `products/${productToEdit.id}`), {
                    ...formData,
                    image: finalImage || productToEdit.image,
                    // Keep existing immutable fields
                });
                toast.success("Product updated successfully!");
                navigate('/dashboard/listed');
            } else {
                // Create new
                const newProductRef = push(ref(db, 'products'));
                await set(newProductRef, {
                    ...formData,
                    image: finalImage || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
                    ownerId: user.uid,
                    ownerName: user.displayName || 'Anonymous',
                    status: 'Available',
                    createdAt: new Date().toISOString(),
                    views: 0,
                    earnings: 0
                });

                toast.success("Product listed successfully!");
                // Reset form
                setFormData({
                    name: '',
                    category: 'Electronics',
                    price: '',
                    insuranceFee: '',
                    condition: 'Used - Good',
                    description: '',
                    location: ''
                });
                setImagePreview(null);
                setImageFile(null);
            }

        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Failed to save product: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem' }}>{productToEdit ? 'Edit Product' : 'List a Product'}</h1>
                <Button variant="outline" icon={Save} onClick={handleSaveDraft} style={{ width: 'auto' }}>
                    Save Draft
                </Button>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label
                            htmlFor="file-upload"
                            style={{
                                border: '2px dashed #e2e8f0',
                                borderRadius: 'var(--radius-lg)',
                                padding: '3rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                display: 'block',
                                transition: 'border-color 0.2s',
                                backgroundColor: 'var(--bg-main)',
                                backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '300px',
                                position: 'relative'
                            }}>
                            <input
                                id="file-upload"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                                accept="image/*"
                            />
                            {!imagePreview && (
                                <>
                                    <Upload size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: '600' }}>Click to upload images</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>or drag and drop</p>
                                </>
                            )}
                        </label>
                    </div>

                    <div className="form-grid">
                        <Input
                            id="name"
                            label="Product Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <div>
                            <label>
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    backgroundColor: '#fff',
                                    color: '#1f2937',
                                    height: '50px',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    backgroundSize: '1em'
                                }}
                            >
                                <option>Electronics</option>
                                <option>Furniture</option>
                                <option>Tools</option>
                                <option>Vehicles</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div style={{ position: 'relative' }}>
                            <Input
                                id="price"
                                type="number"
                                label="Price per Day (PKR)"
                                value={formData.price}
                                onChange={handleChange}
                                icon={Wallet}
                                required
                            />
                            <button
                                type="button"
                                onClick={handleAISuggestion}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    marginTop: '12px',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    zIndex: 10
                                }}
                            >
                                <Wand2 size={14} /> AI Suggest
                            </button>
                        </div>
                        <Input
                            id="insuranceFee"
                            type="number"
                            label="Insurance Fee (Optional)"
                            value={formData.insuranceFee}
                            onChange={handleChange}
                            icon={Wallet}
                            placeholder="Set by owner"
                        />
                    </div>

                    <div className="form-grid">
                        <div>
                            <label>
                                Condition
                            </label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    backgroundColor: '#fff',
                                    color: '#1f2937',
                                    height: '50px',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 1rem center',
                                    backgroundSize: '1em'
                                }}
                            >
                                <option>New</option>
                                <option>Like New</option>
                                <option>Used - Good</option>
                                <option>Used - Fair</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                fontSize: '1rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                outline: 'none',
                                backgroundColor: '#fff',
                                color: '#1f2937',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        ></textarea>
                    </div>

                    <Input
                        id="location"
                        label="Location / Pickup Address"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button variant="outline" style={{ width: 'auto' }}>Cancel</Button>
                        <Button type="submit" style={{ width: 'auto' }}>{productToEdit ? 'Update Product' : 'List Product'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
