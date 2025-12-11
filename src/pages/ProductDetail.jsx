import { useParams } from 'react-router-dom';
import { MapPin, Star, Share2, Heart, MessageCircle, QrCode } from 'lucide-react';
import Button from '../components/Button';

const ProductDetail = () => {
    const { id } = useParams();

    // Mock Data Fetch based on ID
    const product = {
        name: 'Canon EOS DSLR Camera',
        price: 50,
        rating: 4.8,
        reviews: 24,
        description: 'Professional Canon DSLR with 18-55mm lens. Includes carrying bag and 64GB SD card. Perfect for photography enthusiasts and students.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
        owner: 'Jane Doe',
        location: 'Downtown, 1.2 km away'
    };

    const handleRentRequest = () => {
        window.open(`https://wa.me/?text=Hi%20${product.owner},%20I'm%20interested%20in%20renting%20your%20${product.name}`, '_blank');
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{
                height: '400px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: '2rem',
                position: 'relative',
                backgroundColor: '#e2e8f0'
            }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '1rem' }}>
                    <button style={{
                        background: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <Share2 size={20} />
                    </button>
                    <button style={{
                        background: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        <Heart size={20} />
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <h1 style={{ marginBottom: '0.5rem' }}>{product.name}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <Star fill="#f59e0b" color="#f59e0b" size={18} />
                                <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>{product.rating}</span>
                                <span>({product.reviews} reviews)</span>
                            </div>
                            <span>•</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <MapPin size={18} />
                                <span>{product.location}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Description</h3>
                        <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>{product.description}</p>
                    </div>

                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Location</h3>
                        <div style={{
                            height: '200px',
                            backgroundColor: '#e2e8f0',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)'
                        }}>
                            <MapPin size={48} />
                            <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>Map View Mock</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                            ${product.price}
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/day</span>
                        </h2>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Service Fee</span>
                                <span>$5</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Insurance</span>
                                <span>$10</span>
                            </div>
                            <div style={{ borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>Total (1 day)</span>
                                <span>${product.price + 15}</span>
                            </div>
                        </div>

                        <Button onClick={handleRentRequest} icon={MessageCircle} style={{ marginBottom: '1rem' }}>
                            I'm Interested (WhatsApp)
                        </Button>

                        <Button variant="outline" icon={QrCode} onClick={() => alert("Showing QR for Payment/Details")}>
                            Generate QR Code
                        </Button>

                        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            * Secure payment & refundable deposit system active.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
