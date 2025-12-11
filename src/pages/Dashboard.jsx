import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import { Plus } from 'lucide-react';
import Button from '../components/Button';

import ProductList from '../components/ProductList';
import AddProduct from './AddProduct';
import ProductDetail from './ProductDetail';
import TrackProduct from './TrackProduct';
import Profile from './Profile';
import Notifications from './Notifications';

// Placeholder Pages
// Placeholder Pages
const Home = () => (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem' }}>Explore Products</h1>
            <Link to="/dashboard/add-product" style={{ textDecoration: 'none' }}>
                <Button icon={Plus} style={{ width: 'auto' }}>Add Product</Button>
            </Link>
        </div>
        <SearchBar />
        <ProductList />
    </div>
);

// ... (Track, Rentals, Listed kept same)

const Dashboard = () => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <div style={{ width: '260px' }}>
                <Sidebar />
            </div>
            <main style={{
                flex: 1,
                padding: '2rem',
                backgroundColor: '#f8fafc',
                marginLeft: '0'
            }}>
                <div className="container animate-fade-in">
                    <Routes>
                        <Route path="home" element={<Home />} />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="product/:id" element={<ProductDetail />} />
                        <Route path="track" element={<TrackProduct />} />
                        <Route path="rentals" element={<Rentals />} />
                        <Route path="listed" element={<Listed />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="settings" element={<Profile />} /> {/* Reusing Profile for Settings for now */}
                        <Route path="help" element={<h1>Help & Support</h1>} />
                        <Route path="*" element={<Navigate to="home" replace />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
