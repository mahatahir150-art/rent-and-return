import { Bell, MessageCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const Notifications = () => {
    // Mock Notifications
    const notifications = [
        {
            id: 1,
            type: 'message',
            title: 'New Message from Renter',
            description: 'Hi, is this camera still available for this weekend?',
            time: '2 mins ago',
            read: false,
            icon: MessageCircle,
            color: '#3b82f6',
            bg: '#eff6ff'
        },
        {
            id: 2,
            type: 'warning',
            title: 'Return Date Approaching',
            description: 'The Canon DSLR is due for return tomorrow by 5:00 PM.',
            time: '1 hour ago',
            read: false,
            icon: Clock,
            color: '#f59e0b',
            bg: '#fffbeb'
        },
        {
            id: 3,
            type: 'success',
            title: 'Payment Received',
            description: 'You received $50.00 for the Electric Scooter rental.',
            time: '1 day ago',
            read: true,
            icon: CheckCircle,
            color: '#10b981',
            bg: '#ecfdf5'
        },
        {
            id: 4,
            type: 'alert',
            title: 'Security Deposit Refunded',
            description: 'The $200 security deposit has been refunded to your card.',
            time: '3 days ago',
            read: true,
            icon: ShieldCheck, // Wait, ShieldCheck is not imported explicitly here but available via... wait I need to import it.
            // Actually I'll use CheckCircle or AlertTriangle
            icon: CheckCircle,
            color: '#64748b',
            bg: '#f8fafc'
        }
    ];

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Notifications</h1>
                <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>
                    Mark all as read
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map(notification => (
                    <div key={notification.id} className="card" style={{
                        padding: '1.25rem',
                        display: 'flex',
                        gap: '1rem',
                        backgroundColor: notification.read ? 'white' : '#f0f9ff',
                        borderLeft: notification.read ? 'none' : '4px solid var(--primary)',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: notification.bg,
                            color: notification.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <notification.icon size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: notification.read ? '600' : '700' }}>{notification.title}</h3>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notification.time}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{notification.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
// I missed ShieldCheck import
import { ShieldCheck } from 'lucide-react';
// Re-doing the export to be safe and clean.
// Actually checking my code above, I used notification.icon which refers to the object property.
// Object 4 uses CheckCircle now.
// So I don't need ShieldCheck import for Object 4.
// But Object 4 description says "Security Deposit". I'll use Lock or something?
// I'll stuck to CheckCircle as decided.

export default Notifications;
