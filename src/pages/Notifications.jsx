import { useState, useEffect } from 'react';
import { Bell, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { realtimeDb as db, auth } from '../config/firebase';
import { ref, onValue, update, push, set, serverTimestamp, get } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import ItemRequestForm from '../components/ItemRequestForm';
import { PlusCircle } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const notifRef = ref(db, `notifications/${currentUser.uid}`);
                const unsubscribeDb = onValue(notifRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        // Convert object to array and reverse logic for newest first
                        const notifList = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key],
                            icon: data[key].type === 'request' ? Bell : MessageCircle,
                            bg: data[key].type === 'request' ? '#fef3c7' : '#eff6ff',
                            color: data[key].type === 'request' ? '#d97706' : '#3b82f6'
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

    const handleInterested = async (notification) => {
        if (!user) return;

        try {
            // Create Chat
            const chatsRef = ref(db, 'chats');
            const newChatRef = push(chatsRef);
            const chatId = newChatRef.key;

            const requesterId = notification.requesterId;
            const myId = user.uid;

            // Get names for better chat experience
            const requesterRef = ref(db, `users/${requesterId}`);
            const requesterSnap = await get(requesterRef);
            const requesterName = requesterSnap.val()?.fullName || 'User';

            await set(newChatRef, {
                participants: {
                    [myId]: { name: user.displayName || 'Me', id: myId },
                    [requesterId]: { name: requesterName, id: requesterId }
                },
                lastMessage: 'I am interested in your request.',
                lastMessageTime: serverTimestamp(),
                relatedRequestId: notification.requestId
            });

            // Add to user_chats
            const chatMeta = {
                lastMessage: 'I am interested in your request.',
                lastMessageTime: serverTimestamp(),
                participants: {
                    [myId]: { name: user.displayName || 'Me', id: myId },
                    [requesterId]: { name: requesterName, id: requesterId }
                }
            };

            await update(ref(db, `user_chats/${myId}/${chatId}`), chatMeta);
            await update(ref(db, `user_chats/${requesterId}/${chatId}`), chatMeta);

            // Mark notification as read/handled
            await update(ref(db, `notifications/${user.uid}/${notification.id}`), {
                read: true,
                status: 'handled'
            });

            toast.success("Chat started!");
            navigate(`/dashboard/chat/${chatId}`);

        } catch (error) {
            console.error("Error creating chat:", error);
            toast.error("Failed to start chat.");
        }
    };

    const handleNotInterested = async (notificationId) => {
        if (!user) return;
        try {
            await update(ref(db, `notifications/${user.uid}/${notificationId}`), {
                read: true,
                status: 'dismissed'
            });
            toast.success("Notification dismissed");
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkRead = async () => {
        if (!user) return;
        // Mark all as read logic (omitted for brevity in single item updates, but good to have)
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading notifications...</div>;

    if (notifications.length === 0) {
        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '80vh', position: 'relative' }}>
                {/* Request Item FAB */}
                <Button
                    onClick={() => setShowRequestForm(!showRequestForm)}
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        borderRadius: '50px',
                        padding: '1rem 1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        zIndex: 50,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: showRequestForm ? '#ef4444' : 'var(--primary)'
                    }}
                >
                    {showRequestForm ? <XCircle size={20} /> : <PlusCircle size={20} />}
                    {showRequestForm ? 'Cancel Request' : 'Request Item'}
                </Button>

                {showRequestForm && (
                    <div style={{ marginBottom: '2rem' }}>
                        <ItemRequestForm onRequestComplete={() => setShowRequestForm(false)} />
                    </div>
                )}

                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <Bell size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>No Notifications</h3>
                    <p style={{ color: 'var(--text-muted)' }}>You're all caught up!</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', minHeight: '80vh' }}>
            <div style={{ marginBottom: '2rem' }}></div>

            {/* Request Item FAB */}
            <Button
                onClick={() => setShowRequestForm(!showRequestForm)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    borderRadius: '50px',
                    padding: '1rem 1.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: showRequestForm ? '#ef4444' : 'var(--primary)'
                }}
            >
                {showRequestForm ? <XCircle size={20} /> : <PlusCircle size={20} />}
                {showRequestForm ? 'Cancel Request' : 'Request Item'}
            </Button>

            {showRequestForm && (
                <div style={{ marginBottom: '2rem' }}>
                    <ItemRequestForm onRequestComplete={() => setShowRequestForm(false)} />
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.map(notification => (
                    <div key={notification.id} className="card" style={{
                        padding: '1.25rem',
                        display: 'flex',
                        gap: '1rem',
                        backgroundColor: notification.read ? 'white' : '#f0f9ff',
                        borderLeft: notification.read ? 'none' : '4px solid var(--primary)',
                        border: notification.type === 'request' ? '1px solid #fcd34d' : 'none', // Highlight requests
                        transition: 'all 0.2s',
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
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{notification.description}</p>

                            {/* Action Buttons for Requests */}
                            {notification.type === 'request' && !notification.read && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        onClick={() => handleInterested(notification)}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        <CheckCircle size={16} style={{ marginRight: '0.25rem' }} />
                                        I'm Interested
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleNotInterested(notification.id)}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                    >
                                        <XCircle size={16} style={{ marginRight: '0.25rem' }} />
                                        Not Interested
                                    </Button>
                                </div>
                            )}

                            {notification.type === 'request' && notification.read && notification.status === 'handled' && (
                                <div style={{ fontSize: '0.875rem', color: 'var(--success)', fontWeight: '600' }}>
                                    ✓ You responded to this request
                                </div>
                            )}

                            {notification.type === 'request' && notification.read && notification.status === 'dismissed' && (
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    Request dismissed
                                </div>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
