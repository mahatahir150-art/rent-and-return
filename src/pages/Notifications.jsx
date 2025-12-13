import { useState, useEffect } from 'react';
import { Bell, MessageCircle } from 'lucide-react';
import { realtimeDb as db, auth } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                const notifRef = ref(db, `notifications/${user.uid}`);
                const unsubscribeDb = onValue(notifRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        // Convert object to array and reverse logic for newest first
                        const notifList = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key],
                            icon: MessageCircle, // Default icon
                            bg: '#eff6ff',
                            color: '#3b82f6'
                        })).reverse();
                        setNotifications(notifList);
                    } else {
                        setNotifications([]);
                    }
                    setLoading(false);
                });
                return () => unsubscribeDb();
            } else {
                setNotifications([]);
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading notifications...</div>;

    if (notifications.length === 0) {
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                <Bell size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>No Notifications</h3>
                <p style={{ color: 'var(--text-muted)' }}>You're all caught up!</p>
            </div>
        );
    }

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
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {notification.time ? new Date(notification.time).toLocaleString() : ''}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{notification.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
