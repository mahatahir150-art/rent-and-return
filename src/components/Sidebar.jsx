import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Package, Bell, HelpCircle, LogOut, LayoutDashboard, PlusCircle, CreditCard, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navigate = useNavigate();
    const menuItems = [
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
        { icon: Home, label: 'Home', path: '/dashboard/home' },
        { icon: PlusCircle, label: 'Add Product', path: '/dashboard/add-product' },
        { icon: Search, label: 'Track My Product', path: '/dashboard/track' },
        { icon: Package, label: 'My Rentals', path: '/dashboard/rentals' },
        { icon: LayoutDashboard, label: 'My Listed Products', path: '/dashboard/listed' },
        { icon: CreditCard, label: 'Digital Bank', path: '/dashboard/bank' },
        { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
        { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/help' },
    ];

    const handleLogout = async () => {
        try {
            const { signOut } = await import('firebase/auth');
            const { auth } = await import('../config/firebase');
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <aside className="sidebar-container glass-panel">
            {/* Logo Section */}
            <div className="sidebar-header">
                <div className="logo-icon">
                    RR
                </div>
                <h2 className="app-title text-gradient">
                    RentReturn
                </h2>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav custom-scrollbar">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="active-tab-bg"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon
                                    size={20}
                                    className="sidebar-icon"
                                    color={isActive ? 'var(--primary)' : '#64748b'}
                                />
                                <span className="sidebar-label">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="active-dot"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="sidebar-footer">
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};
export default Sidebar;
