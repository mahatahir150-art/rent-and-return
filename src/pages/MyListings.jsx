import { useState, useEffect } from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { auth, realtimeDb as db } from '../config/firebase';
import { ref, query, orderByChild, equalTo, onValue, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const productsRef = ref(db, 'products');
                const myProductsQuery = query(productsRef, orderByChild('ownerId'), equalTo(user.uid));

                const unsubscribeData = onValue(myProductsQuery, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const productList = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        }));
                        setListings(productList);
                    } else {
                        setListings([]);
                    }
                    setLoading(false);
                });

                return () => unsubscribeData();
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            try {
                await remove(ref(db, `products/${productId}`));
                // State updates automatically via onValue listener
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("Failed to delete product.");
            }
        }
    };

    const handleEdit = (product) => {
        navigate('/dashboard/add-product', { state: { productToEdit: product } });
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading your listings...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>My Listed Products</h1>
                <Button onClick={() => navigate('/dashboard/add-product')}>+ Add New Listing</Button>
            </div>

            {listings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <p>You haven't listed any products yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {listings.map(item => (
                        <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
                            <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: item.status === 'Available' ? 'var(--success)' : 'var(--warning)',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '15px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600'
                                }}>
                                    {item.status}
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '1rem' }}>PKR {item.price} / day</p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                                    <div>Total Earnings: <b>PKR {item.earnings || 0}</b></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={16} /> {item.views || 0}</div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button variant="outline" style={{ flex: 1 }} onClick={() => handleEdit(item)}>
                                        <Edit size={16} style={{ marginRight: '0.25rem' }} /> Edit
                                    </Button>
                                    <Button variant="outline" style={{ color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => handleDelete(item.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
