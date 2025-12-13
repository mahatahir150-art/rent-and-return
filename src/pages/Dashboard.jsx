import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import { Plus, Menu } from 'lucide-react';
import Button from '../components/Button';

import ProductList from '../components/ProductList';
import AddProduct from './AddProduct';
import ProductDetail from './ProductDetail';
import TrackProduct from './TrackProduct';
import Profile from './Profile';
import Notifications from './Notifications';
import Bank from './Bank';
import BankingSetup from './BankingSetup';

import { useState } from 'react';

import MyRentals from './MyRentals';
import MyListings from './MyListings';
import HelpSupport from './HelpSupport';

// Placeholder Pages - Adjusted to remove internal Headers
const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            {/* Header moved to Dashboard */}
            <SearchBar onSearch={setSearchQuery} />
            <ProductList searchQuery={searchQuery} />
        </div>
    );
};

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    // Mapping paths to titles
    const getPageTitle = (pathname) => {
        if (pathname.includes('/home')) return 'Explore Products';
        if (pathname.includes('/add-product')) return 'Add New Product';
        if (pathname.includes('/track')) return 'Track Product';
        if (pathname.includes('/rentals')) return 'My Rentals';
        if (pathname.includes('/listed')) return 'My Listings';
        if (pathname.includes('/notifications')) return 'Notifications';
        if (pathname.includes('/bank')) return 'Digital Bank';
        if (pathname.includes('/banking-setup')) return 'Banking Setup';
        if (pathname.includes('/profile')) return 'My Profile';
        if (pathname.includes('/settings')) return 'Settings';
        if (pathname.includes('/help')) return 'Help & Support';
        if (pathname.includes('/product/')) return 'Product Details';
        return 'Dashboard';
    };

    const pageTitle = getPageTitle(location.pathname);

    return (
        <div style={{ display: 'flex', height: '100vh', flexDirection: 'row', overflow: 'hidden' }}>
            {/* Sidebar Container */}
            <div style={{
                width: isSidebarOpen ? '260px' : '0px',
                flexShrink: 0,
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                borderRight: isSidebarOpen ? 'none' : '1px solid transparent'
            }}>
                <div style={{ width: '260px', height: '100%' }}>
                    <Sidebar />
                </div>
            </div>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: '2rem',
                backgroundColor: 'var(--bg-main)',
                marginLeft: '0',
                overflowY: 'auto',
                position: 'relative'
            }}>
                <div className="container" style={{ maxWidth: '1600px', margin: '0 auto' }}>

                    {/* Header Bar: Toggle + Centered Title */}
                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                        {/* Left: Hamburger */}
                        <div style={{ flex: '0 0 auto' }}>
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-main)',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Menu size={28} />
                            </button>
                        </div>

                        {/* Center: Title */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <h1 style={{
                                fontSize: '2.5rem',
                                margin: 0,
                                textAlign: 'center',
                                color: 'var(--primary)',
                                fontWeight: '800'
                            }}>
                                {pageTitle}
                            </h1>
                        </div>

                        {/* Right: Spacer to balance Hamburger (optional, improves true centering) */}
                        <div style={{ flex: '0 0 40px' }}></div>
                    </div>

                    <Routes>
                        <Route index element={<Navigate to="/dashboard/home" replace />} />
                        <Route path="home" element={<Home />} />
                        <Route path="add-product" element={<AddProduct />} />
                        <Route path="product/:id" element={<ProductDetail />} />
                        <Route path="track" element={<TrackProduct />} />
                        <Route path="rentals" element={<MyRentals />} />
                        <Route path="listed" element={<MyListings />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="bank" element={<Bank />} />
                        <Route path="banking-setup" element={<BankingSetup />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Profile />} />
                        <Route path="help" element={<HelpSupport />} />
                        <Route path="*" element={<div>Route Not Found: {window.location.pathname}</div>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

// Re-forcing module load
