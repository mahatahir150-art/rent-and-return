import ProductCard from './ProductCard';

const ProductList = () => {
    // Mock Data
    const products = [
        {
            id: 1,
            name: 'DSLR Camera',
            price: 50,
            rating: 4.8,
            distance: '1.2 km',
            description: 'Professional Canon DSLR with 18-55mm lens. Perfect for photography enthusiasts.',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 2,
            name: 'Electric Scooter',
            price: 25,
            rating: 4.5,
            distance: '0.5 km',
            description: 'Xiaomi M365 electric scooter. Great for city commute.',
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 3,
            name: 'Camping Tent',
            price: 30,
            rating: 4.9,
            distance: '3.0 km',
            description: '4-person waterproof camping tent. Easy to set up.',
            image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 4,
            name: 'Gaming Console',
            price: 40,
            rating: 4.7,
            distance: '2.5 km',
            description: 'PlayStation 5 with 2 controllers and 5 games.',
            image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 5,
            name: 'Drill Machine',
            price: 15,
            rating: 4.2,
            distance: '0.8 km',
            description: 'Cordless power drill with full bit set.',
            image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=500&q=80'
        },
        {
            id: 6,
            name: 'Mountain Bike',
            price: 35,
            rating: 4.6,
            distance: '1.5 km',
            description: 'Trek mountain bike with suspension. Helmet included.',
            image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=500&q=80'
        }
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            paddingBottom: '2rem'
        }}>
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
