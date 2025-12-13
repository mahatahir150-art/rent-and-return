import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import { Plus, Menu } from 'lucide-react';
import Button from '../components/Button';
import ProductList from '../components/ProductList';
import { useState, useEffect, Suspense, lazy } from 'react';

// Lazy Load Pages - Commented out for binary search
// Lazy Load Pages
const AddProduct = lazy(() => import('./AddProduct'));
const ProductDetail = lazy(() => import('./ProductDetail'));
const TrackProduct = lazy(() => import('./TrackProduct'));
const Profile = lazy(() => import('./Profile'));
const Notifications = lazy(() => import('./Notifications'));
const Bank = lazy(() => import('./Bank'));
const BankingSetup = lazy(() => import('./BankingSetup'));
const MyRentals = lazy(() => import('./MyRentals'));
const MyListings = lazy(() => import('./MyListings'));
const HelpSupport = lazy(() => import('./HelpSupport'));

// Placeholder Pages - Adjusted to remove internal Headers
// Placeholder Pages - Adjusted to remove internal Headers
const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div>
            <SearchBar onSearch={setSearchQuery} />
            <ProductList searchQuery={searchQuery} />
        </div>
    );
};

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const location = useLocation();

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mapping paths to titles
    const getPageTitle = (pathname) => {
        if (pathname.includes('/home')) return 'Explore Products';
        if (pathname.includes('/add-product')) return 'Add New Product';
        if (pathname.includes('/track')) return 'Track Product';
        if (pathname.includes('/rentals')) return 'My Rentals';
        if (pathname.includes('/listed')) return 'My Listed Products';
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
            {/* Mobile Overlay Backdrop */}
            {isMobile && isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 40,
                        backdropFilter: 'blur(4px)'
                    }}
                />
            )}

            {/* Sidebar Container */}
            <div style={{
                position: isMobile ? 'fixed' : 'relative',
                top: 0,
                left: 0,
                height: '100%',
                width: '260px',
                zIndex: 50,
                transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                marginRight: isMobile ? 0 : (isSidebarOpen ? 0 : '-260px'), // Negative margin to collapse space on desktop
                flexShrink: 0
            }}>
                <div style={{ width: '260px', height: '100%', background: 'var(--bg-main)' }}>
                    <Sidebar />
                </div>
            </div>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: isMobile ? '1rem' : '2rem',
                backgroundColor: 'var(--bg-main)',
                overflowY: 'auto',
                position: 'relative',
                width: '100%'
            }}>
                <div className="container" style={{ maxWidth: '1600px', margin: '0 auto', paddingBottom: '80px' }}>

                    {/* Header Bar: Toggle + Centered Title */}
                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                        {/* Left: Hamburger */}
                        <div style={{ flex: '0 0 auto' }}>
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                style={{
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s',
                                    boxShadow: 'var(--shadow-sm)'
                                }}
                            >
                                <Menu size={24} />
                            </button>
                        </div>

                        {/* Center: Title */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                            <h1 style={{
                                fontSize: isMobile ? '1.5rem' : '2.5rem',
                                margin: 0,
                                textAlign: 'center',
                                color: 'var(--primary)',
                                fontWeight: '800'
                            }}>
                                {pageTitle}
                            </h1>
                        </div>

                        {/* Right: Spacer to balance Hamburger */}
                        <div style={{ flex: '0 0 40px' }}></div>
                    </div>

                    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
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
                    </Suspense>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;
