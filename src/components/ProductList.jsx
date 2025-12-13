import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { realtimeDb as db } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

const ProductList = ({ searchQuery = '' }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productsRef = ref(db, 'products');
        const unsubscribe = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const productList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                // Filter out deleted or invalid items if necessary
                setProducts(productList.reverse()); // Show newest first
            } else {
                setProducts([]);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredProducts = products.filter(product => {
        const query = searchQuery.toLowerCase();
        return (
            product.name?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.location?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading products...</div>;
    }

    if (filteredProducts.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.1rem' }}>No products found matching "{searchQuery}"</p>
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2rem'
        }}>
            {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
