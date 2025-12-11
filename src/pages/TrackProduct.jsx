import { QrCode, User, Clock, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react';
import Button from '../components/Button';

const TrackProduct = () => {
    // Mock Data
    const trackingData = {
        productName: 'Canon EOS DSLR Camera',
        renter: {
            name: 'Michael Scott',
            trustScore: 4.9,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
        },
        status: 'active', // active, late, returned
        returnDate: '2025-12-15',
        daysLeft: 3
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Track My Product</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <div style={{ textAlign: 'center', padding: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            margin: '0 auto 1.5rem',
                            background: '#f8fafc',
                            border: '4px solid var(--primary)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <QrCode size={100} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '1.25rem' }}>{trackingData.productName}</h2>
                        <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            background: '#dcfce7',
                            color: '#166534',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            marginTop: '0.5rem'
                        }}>
                            Active Rental
                        </span>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img
                                    src={trackingData.renter.image}
                                    alt={trackingData.renter.name}
                                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                                <div>
                                    <p style={{ fontWeight: 'bold' }}>{trackingData.renter.name}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Trust Score: {trackingData.renter.trustScore}/5.0</p>
                                </div>
                            </div>
                            <Button variant="outline" icon={MessageSquare} style={{ width: 'auto', padding: '0.5rem' }} />
                        </div>

                        <div style={{
                            background: '#fee2e2',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                            color: '#991b1b'
                        }}>
                            <Clock />
                            <div>
                                <p style={{ fontWeight: 'bold' }}>Return Due in {trackingData.daysLeft} Days</p>
                                <p style={{ fontSize: '0.875rem' }}>{trackingData.returnDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Tracking History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <CheckCircle size={14} />
                                </div>
                                <div style={{ width: '2px', flex: 1, background: '#e2e8f0', margin: '0.5rem 0' }}></div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem' }}>Product Picked Up</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Dec 10, 2025 - 10:30 AM</p>
                                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem' }}>Verified via QR Code scan by Renter.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <CheckCircle size={14} />
                                </div>
                                <div style={{ width: '2px', flex: 1, background: '#e2e8f0', margin: '0.5rem 0' }}></div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem' }}>Rental Request Approved</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Dec 09, 2025 - 02:15 PM</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }}></div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Product Returned</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Expected Dec 15, 2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackProduct;
