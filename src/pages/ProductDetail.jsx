import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Share2, Heart, MessageCircle, QrCode, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { hasBankingDetails } from '../utils/firebaseBankingUtils';

import { ref, get } from 'firebase/database';
import { realtimeDb as db, auth } from '../config/firebase';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasBanking, setHasBanking] = useState(false);
    const [isCheckingBanking, setIsCheckingBanking] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Try fetching from real DB first
                const productRef = ref(db, `products/${id}`);
                const snapshot = await get(productRef);

                if (snapshot.exists()) {
                    setProduct({ id, ...snapshot.val() });
                } else {
                    // Fallback to local mock data if not found (for legacy support during transition)
                    const localProduct = products.find(p => p.id === parseInt(id));
                    if (localProduct) {
                        setProduct(localProduct);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        const checkBanking = async () => {
            const hasDetails = await hasBankingDetails();
            setHasBanking(hasDetails);
            setIsCheckingBanking(false);
        };

        fetchProduct();
        checkBanking();
    }, [id]);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading product details...</div>;

    if (!product) {
        return <div>Product not found</div>;
    }

    const handleRentRequest = async () => {
        // Check if banking details are set up
        if (!hasBanking) {
            const confirmSetup = window.confirm(
                'Banking details are required to rent products. Would you like to set them up now?'
            );
            if (confirmSetup) {
                navigate('/dashboard/banking-setup', {
                    state: { returnUrl: `/dashboard/product/${id}` }
                });
            }
            return;
        }

        // Send Notification to Owner
        if (product.ownerId && auth.currentUser) {
            try {
                const { push, ref: dbRef, set } = await import('firebase/database'); // Dynamic import to avoid circular dependency issues if any
                const notifRef = push(dbRef(db, `notifications/${product.ownerId}`));

                await set(notifRef, {
                    type: 'message',
                    title: `Rental Request: ${product.name}`,
                    description: `${auth.currentUser.displayName || 'A user'} is interested in renting your ${product.name}.`,
                    time: new Date().toISOString(),
                    read: false,
                    productId: product.id,
                    senderId: auth.currentUser.uid
                });
                toast.success("Rental request sent! The owner has been notified.");
            } catch (err) {
                console.error("Failed to send notification:", err);
                // Fallback to WhatsApp if notification fails or for immediate contact
                window.open(`https://wa.me/?text=Hi%20${product.ownerName || 'Owner'},%20I'm%20interested%20in%20renting%20your%20${product.name}`, '_blank');
            }
        } else {
            // Fallback for legacy items without ownerId
            window.open(`https://wa.me/?text=Hi,%20I'm%20interested%20in%20renting%20your%20${product.name}`, '_blank');
        }
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Banking Setup Warning */}
            {!isCheckingBanking && !hasBanking && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '2px solid #f59e0b',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <AlertCircle size={24} style={{ color: '#d97706', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                        <p style={{ color: '#92400e', fontWeight: '600', marginBottom: '0.25rem' }}>
                            Banking Details Required
                        </p>
                        <p style={{ color: '#78350f', fontSize: '0.875rem' }}>
                            Set up your banking details to rent this product.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/banking-setup', { state: { returnUrl: `/dashboard/product/${id}` } })}
                        style={{
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Setup Now
                    </button>
                </div>
            )}

            <div style={{
                height: '400px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: '2rem',
                position: 'relative',
                backgroundColor: '#f5f5f4'
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
                            <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>Map View Mock (Lahore)</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card" style={{ position: 'sticky', top: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                            Rs. {product.price.toLocaleString()}
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/day</span>
                        </h2>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Service Fee (5%)</span>
                                <span>Rs. {(product.price * 0.05).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Insurance (Set by Owner)</span>
                                <span>Rs. {(product.insuranceFee ? parseInt(product.insuranceFee) : 0).toLocaleString()}</span>
                            </div>
                            <div style={{ borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <span>Total (1 day)</span>
                                <span>Rs. {(parseInt(product.price) + (product.price * 0.05) + (product.insuranceFee ? parseInt(product.insuranceFee) : 0)).toLocaleString()}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleRentRequest}
                            icon={MessageCircle}
                            style={{ marginBottom: '1rem' }}
                            disabled={!hasBanking}
                        >
                            {hasBanking ? "I'm Interested (WhatsApp)" : "Setup Banking to Rent"}
                        </Button>

                        <Button variant="outline" icon={QrCode} onClick={() => toast("QR Code feature coming soon!", { icon: '📱' })}>
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
