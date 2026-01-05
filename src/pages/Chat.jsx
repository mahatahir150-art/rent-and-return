import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, User, MessageCircle, ArrowLeft } from 'lucide-react';
import { realtimeDb as db, auth } from '../config/firebase';
import { ref, onValue, push, set, get, update, serverTimestamp } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '../components/Button';

const Chat = () => {
    const { chatId } = useParams(); // can be undefined if just viewing list
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    // Auth & Load Chats
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userChatsRef = ref(db, `user_chats/${currentUser.uid}`);
                onValue(userChatsRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const chatList = Object.keys(data).map(key => ({
                            id: key,
                            ...data[key]
                        })).sort((a, b) => b.lastMessageTime - a.lastMessageTime);
                        setChats(chatList);
                    } else {
                        setChats([]);
                    }
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // Load Active Chat
    useEffect(() => {
        if (chatId && user) {
            // Mark chat as active/read logic could go here
            const chatRef = ref(db, `chats/${chatId}`);
            get(chatRef).then(snap => {
                if (snap.exists()) {
                    setActiveChat({ id: chatId, ...snap.val() });
                }
            });

            const messagesRef = ref(db, `messages/${chatId}`);
            const unsubMessages = onValue(messagesRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setMessages(Object.values(data));
                } else {
                    setMessages([]);
                }
            });

            return () => unsubMessages();
        } else {
            setActiveChat(null);
            setMessages([]);
        }
    }, [chatId, user]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || !user) return;

        try {
            const messageRef = push(ref(db, `messages/${activeChat.id}`));
            await set(messageRef, {
                senderId: user.uid,
                text: newMessage,
                timestamp: serverTimestamp()
            });

            // Update last message in chat metadata and user_chats
            const lastMsg = {
                lastMessage: newMessage,
                lastMessageTime: serverTimestamp()
            };

            await update(ref(db, `chats/${activeChat.id}`), lastMsg);

            // Update both participants' chat lists
            const participants = activeChat.participants || {};
            Object.keys(participants).forEach(uid => {
                update(ref(db, `user_chats/${uid}/${activeChat.id}`), lastMsg);
            });

            setNewMessage('');
        } catch (error) {
            console.error("Fetch error", error);
        }
    };

    const getOtherParticipantName = (chat) => {
        if (!user || !chat.participants) return 'Chat';
        // Simple logic: find key that is not me
        const otherId = Object.keys(chat.participants).find(id => id !== user.uid);
        return chat.participants[otherId]?.name || 'User';
    };

    if (loading) return <div className="p-4 text-center">Loading chats...</div>;

    // Mobile View Logic: If chatId is present, show chat window. Else show list.
    // Desktop View Logic: Split screen.
    const isMobile = window.innerWidth < 768;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '1rem', overflow: 'hidden' }}>
            {/* Sidebar / Chat List */}
            <div className={`card ${isMobile && chatId ? 'hidden' : ''}`} style={{
                width: isMobile ? '100%' : '300px',
                display: 'flex',
                flexDirection: 'column',
                padding: 0,
                overflow: 'hidden'
            }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Messages</h2>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {chats.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No messages yet.
                        </div>
                    ) : (
                        chats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => navigate(`/dashboard/chat/${chat.id}`)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #f1f5f9',
                                    cursor: 'pointer',
                                    backgroundColor: chatId === chat.id ? '#f0f9ff' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                <div style={{ background: '#e2e8f0', padding: '0.5rem', borderRadius: '50%' }}>
                                    <User size={20} color="#64748b" />
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{getOtherParticipantName(chat)}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {chat.lastMessage || 'Start a conversation'}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            {(chatId || !isMobile) && (
                <div className={`card ${isMobile && !chatId ? 'hidden' : ''}`} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 0,
                    overflow: 'hidden'
                }}>
                    {!chatId ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <MessageCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>Select a chat to start messaging</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div style={{
                                padding: '1rem',
                                borderBottom: '1px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                background: 'white'
                            }}>
                                {isMobile && (
                                    <button onClick={() => navigate('/dashboard/chat')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <ArrowLeft size={24} />
                                    </button>
                                )}
                                <div style={{ fontWeight: 'bold' }}>
                                    {activeChat ? getOtherParticipantName(activeChat) : 'Chat'}
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc' }}>
                                {messages.map(msg => {
                                    const isMe = msg.senderId === user?.uid;
                                    return (
                                        <div key={msg.id || Math.random()} style={{
                                            alignSelf: isMe ? 'flex-end' : 'flex-start',
                                            maxWidth: '70%',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '1rem',
                                            backgroundColor: isMe ? 'var(--primary)' : 'white',
                                            color: isMe ? 'white' : 'inherit',
                                            boxShadow: 'var(--shadow-sm)',
                                            borderBottomRightRadius: isMe ? '0' : '1rem',
                                            borderBottomLeftRadius: isMe ? '1rem' : '0'
                                        }}>
                                            {msg.text}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', background: 'white' }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    style={{
                                        flex: 1,
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-pill)',
                                        border: '1px solid #e2e8f0',
                                        outline: 'none'
                                    }}
                                />
                                <Button type="submit" disabled={!newMessage.trim()} style={{ borderRadius: '50%', width: '45px', height: '45px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Send size={20} />
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chat;
