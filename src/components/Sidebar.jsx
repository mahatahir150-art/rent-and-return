import { NavLink } from 'react-router-dom';
import { Home, Search, Package, Bell, HelpCircle, Settings, LogOut, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: Home, label: 'Home', path: '/dashboard/home' },
        { icon: Search, label: 'Track My Product', path: '/dashboard/track' },
        { icon: Package, label: 'My Rentals', path: '/dashboard/rentals' },
        { icon: LayoutDashboard, label: 'My Listed Products', path: '/dashboard/listed' },
        { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
        { icon: HelpCircle, label: 'Help & Support', path: '/dashboard/help' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    return (
        <aside style={{
            width: '260px',
            height: '100vh',
            backgroundColor: 'var(--bg-card)',
            borderRight: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 10
        }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 'bold' }}>Rent & Return</h2>
            </div>

            <nav style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'sidebar-link active' : 'sidebar-link'
                        }
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            backgroundColor: isActive ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                            textDecoration: 'none',
                            marginBottom: '0.5rem',
                            fontWeight: isActive ? 600 : 500,
                            transition: 'all 0.2s ease'
                        })}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--error)',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600
                }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
