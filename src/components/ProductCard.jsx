import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link
            to={`/dashboard/product/${product.id}`}
            className="card"
            style={{
                padding: '0',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit'
            }}
        >
            <div style={{ height: '200px', backgroundColor: '#e2e8f0', position: 'relative' }}>
                <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    {product.rating}
                </div>
            </div>

            <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0' }}>{product.name}</h3>
                    <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>${product.price}/day</span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
                    {product.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <MapPin size={14} />
                    <span>{product.distance} away</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
