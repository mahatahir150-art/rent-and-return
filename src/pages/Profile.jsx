import { User, ShieldCheck, CreditCard, History, Edit, Star } from 'lucide-react';
import Button from '../components/Button';

const Profile = () => {
    // Mock User Data
    const user = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '+1 (555) 123-4567',
        kycStatus: 'Verified',
        reliabilityScore: 4.8,
        joinDate: 'Jan 2024',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    };

    const rentalHistory = [
        { id: 1, item: 'Drill Machine', date: 'Dec 01, 2025', status: 'Returned', cost: '$15' },
        { id: 2, item: 'Camping Tent', date: 'Nov 20, 2025', status: 'Returned', cost: '$45' },
        { id: 3, item: 'Projector', date: 'Oct 15, 2025', status: 'Returned', cost: '$30' },
    ];

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                    <img
                        src={user.image}
                        alt={user.name}
                        style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f1f5f9' }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: 'var(--success)',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '0.5rem',
                        border: '2px solid white'
                    }}>
                        <ShieldCheck size={20} />
                    </div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user.name}</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Member since {user.joinDate}</p>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#fffbeb', padding: '0.25rem 0.75rem', borderRadius: '999px', color: '#b45309' }}>
                                    <Star size={16} fill="#b45309" />
                                    <span style={{ fontWeight: 'bold' }}>{user.reliabilityScore} Rating</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#dcfce7', padding: '0.25rem 0.75rem', borderRadius: '999px', color: '#166534' }}>
                                    <ShieldCheck size={16} />
                                    <span style={{ fontWeight: 'bold' }}>KYC Verified</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" icon={Edit} style={{ width: 'auto' }}>Edit Profile</Button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Personal Information</h3>
                    <div className="card">
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="label">Email Address</label>
                            <p>{user.email}</p>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="label">Phone Number</label>
                            <p>{user.phone}</p>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label className="label">Address</label>
                            <p>123 Main St, New York, NY 10001</p>
                        </div>
                        <div>
                            <label className="label">Payment Methods</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                <CreditCard size={20} />
                                <span>Visa ending in 4242</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Rental History</h3>
                    <div className="card" style={{ padding: '0' }}>
                        {rentalHistory.map((history, index) => (
                            <div key={history.id} style={{
                                padding: '1rem',
                                borderBottom: index !== rentalHistory.length - 1 ? '1px solid #e2e8f0' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                                        <History size={20} color="var(--text-muted)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600' }}>{history.item}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{history.date}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 'bold' }}>{history.cost}</p>
                                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.125rem 0.5rem', borderRadius: '999px' }}>{history.status}</span>
                                </div>
                            </div>
                        ))}
                        <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                            <Button variant="outline" style={{ width: '100%' }}>View All History</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
