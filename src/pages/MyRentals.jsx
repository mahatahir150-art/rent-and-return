import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Button from '../components/Button';
import { auth, realtimeDb as db } from '../config/firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';

const MyRentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Determine 'renterId' or similar in future
                // For now, we query a 'rentals' node which might not exist typically, 
                // but this removes the Hardcoded data.
                setRentals([]);
                setLoading(false);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading rentals...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem' }}>My Rentals</h1>

            {rentals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <p>No active rentals found.</p>
                    <Button variant="outline" style={{ marginTop: '1rem', width: 'auto' }} onClick={() => window.location.href = '/dashboard/home'}>
                        Browse Products
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {rentals.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', alignItems: 'center' }}>
                            {/* Render logic would go here once we have real rental data structure */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRentals;
