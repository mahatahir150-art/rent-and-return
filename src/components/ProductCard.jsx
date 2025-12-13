import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGlobal } from '../context/GlobalContext';

const ProductCard = ({ product }) => {
    const { formatPrice } = useGlobal();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -8 }}
            className="product-card-wrapper"
        >
            <Link
                to={`/dashboard/product/${product.id}`}
                className="product-card glass-card"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none' }}
                onClick={(e) => {
                    // e.stopPropagation(); // Just in case, though Link usually handles it
                }}
            >
                {/* Image Container */}
                <div className="product-image-container">
                    <div className="hover-overlay" />
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        onError={(e) => { e.target.style.display = 'none' }}
                    />

                    {/* Rating Badge */}
                    <div className="rating-badge">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        {product.rating}
                    </div>
                </div>

                {/* Content */}
                <div className="product-content">
                    <div className="product-header">
                        <h3 className="product-title">{product.name}</h3>
                    </div>

                    <p className="product-description">
                        {product.description}
                    </p>

                    <div className="product-footer">
                        <div>
                            <span className="price-label">Daily Rate</span>
                            <div className="price-value">
                                {formatPrice(product.price)}
                            </div>
                        </div>

                        <div className="distance-badge">
                            <MapPin size={12} />
                            <span>{product.distance}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
