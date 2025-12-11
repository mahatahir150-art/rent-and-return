import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Upload, DollarSign, QrCode, Save, Wand2 } from 'lucide-react';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Electronics',
        price: '',
        condition: 'Used - Good',
        description: '',
        location: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id || e.target.name]: e.target.value });
    };

    const handleAISuggestion = () => {
        alert("AI Analyzing product... Suggested Price: $45/day");
        setFormData(prev => ({ ...prev, price: '45' }));
    };

    const handleSaveDraft = () => {
        alert("Draft saved successfully!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Product Submitted:", formData);
        alert("Product listed successfully! QR Code generated.");
        // Redirect logic would go here
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '2rem' }}>List a Product</h1>
                <Button variant="outline" icon={Save} onClick={handleSaveDraft} style={{ width: 'auto' }}>
                    Save Draft
                </Button>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                            border: '2px dashed #e2e8f0',
                            borderRadius: 'var(--radius-lg)',
                            padding: '3rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s',
                            backgroundColor: '#f8fafc'
                        }}>
                            <Upload size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                            <p style={{ fontWeight: '600' }}>Click to upload images</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>or drag and drop</p>
                            <Button
                                variant="outline"
                                style={{ width: 'auto', marginTop: '1rem' }}
                                onClick={(e) => { e.preventDefault(); alert('Image auto-fill simulation: Product recognized as DSLR Camera'); setFormData(prev => ({ ...prev, name: 'Canon DSLR', category: 'Electronics' })); }}
                            >
                                Test Auto-Fill from Picture
                            </Button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <Input
                            id="name"
                            label="Product Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <div>
                            <label className="label">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option>Electronics</option>
                                <option>Furniture</option>
                                <option>Tools</option>
                                <option>Vehicles</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Input
                                id="price"
                                type="number"
                                label="Price per Day ($)"
                                value={formData.price}
                                onChange={handleChange}
                                icon={DollarSign}
                                required
                            />
                            <button
                                type="button"
                                onClick={handleAISuggestion}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Wand2 size={14} /> AI Suggest
                            </button>
                        </div>
                        <div>
                            <label className="label">Condition</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option>New</option>
                                <option>Like New</option>
                                <option>Used - Good</option>
                                <option>Used - Fair</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Description</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="input-field"
                            rows="4"
                            style={{ resize: 'vertical' }}
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
                        <Button type="submit" style={{ width: 'auto' }} icon={QrCode}>Generate QR & List Product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
