import { useState } from 'react';
import { MapPin, Search, DollarSign, Send } from 'lucide-react';
import Button from './Button';
import { realtimeDb as db, auth } from '../config/firebase';
import { ref, push, set, get, serverTimestamp } from 'firebase/database';
import { calculateDistance } from '../utils/locationUtils';
import toast from 'react-hot-toast';

const ItemRequestForm = ({ onRequestComplete }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        minBudget: '',
        maxBudget: '',
        radius: 5, // km
        description: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            toast.error("Please login to submit a request.");
            return;
        }

        if (!formData.productName || !formData.maxBudget) {
            toast.error("Please fill in required fields.");
            return;
        }

        setLoading(true);
        try {
            // 1. Get requester's location
            const userRef = ref(db, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val();
            const userLocation = userData?.location;

            if (!userLocation) {
                toast.error("Your location is not set. Please update your profile/allow location access.");
                setLoading(false);
                return;
            }

            // 2. Create Request Record
            const requestsRef = ref(db, 'item_requests');
            const newRequestRef = push(requestsRef);
            const requestId = newRequestRef.key;

            const requestData = {
                id: requestId,
                requesterId: user.uid,
                requesterName: user.displayName || userData?.fullName || 'User',
                productName: formData.productName,
                budget: { min: formData.minBudget, max: formData.maxBudget },
                radius: formData.radius,
                location: userLocation,
                description: formData.description,
                status: 'active',
                createdAt: serverTimestamp()
            };

            await set(newRequestRef, requestData);

            // 3. Find Matches & Send Notifications (Client-side simulation for MVP)
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);

            if (usersSnapshot.exists()) {
                const allUsers = usersSnapshot.val();
                let matchCount = 0;

                const notificationsPromises = Object.keys(allUsers).map(async (otherUserId) => {
                    // Skip self
                    if (otherUserId === user.uid) return;

                    const otherUser = allUsers[otherUserId];

                    // Check KYC verification (assuming 'verified' boolean or 'emailVerified')
                    // Logic: Must be verified to receive these requests (as per requirement)
                    const isVerified = otherUser.emailVerified || otherUser.verified;

                    if (!isVerified) return;

                    // Check Distance
                    if (otherUser.location) {
                        const distance = calculateDistance(
                            userLocation.lat, userLocation.lng,
                            otherUser.location.lat, otherUser.location.lng
                        );

                        if (distance <= formData.radius) {
                            // Match found! Send notification
                            matchCount++;
                            const notifRef = push(ref(db, `notifications/${otherUserId}`));
                            await set(notifRef, {
                                type: 'request',
                                title: `New Request Nearby: ${formData.productName}`,
                                description: `${requestData.requesterName} is looking for ${formData.productName} within ${Math.round(distance)}km of you. Budget: ${formData.minBudget}-${formData.maxBudget}`,
                                requestId: requestId,
                                requesterId: user.uid,
                                time: new Date().toISOString(),
                                read: false
                            });
                        }
                    }
                });

                await Promise.all(notificationsPromises);
                toast.success(`Request submitted! Notified ${matchCount} users nearby.`);
            } else {
                toast.success("Request submitted!");
            }

            // Reset form
            setFormData({
                productName: '',
                minBudget: '',
                maxBudget: '',
                radius: 5,
                description: ''
            });

            if (onRequestComplete) onRequestComplete();

        } catch (error) {
            console.error("Error submitting request:", error);
            toast.error("Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={20} className="text-primary" />
                Request an Item
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label className="label">What do you need?</label>
                    <div className="input-with-icon">
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            name="productName"
                            placeholder="e.g. Drill Machine, DSLR Camera"
                            value={formData.productName}
                            onChange={handleChange}
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label className="label">Min Budget</label>
                        <div className="input-with-icon">
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>Rs.</span>
                            <input
                                type="number"
                                name="minBudget"
                                placeholder="0"
                                value={formData.minBudget}
                                onChange={handleChange}
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">Max Budget</label>
                        <div className="input-with-icon">
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>Rs.</span>
                            <input
                                type="number"
                                name="maxBudget"
                                placeholder="5000"
                                value={formData.maxBudget}
                                onChange={handleChange}
                                className="input-field"
                                style={{ paddingLeft: '2.5rem' }}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Search Radius</span>
                        <span className="text-primary font-bold">{formData.radius} km</span>
                    </label>
                    <input
                        type="range"
                        name="radius"
                        min="1"
                        max="50"
                        value={formData.radius}
                        onChange={handleChange}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        <span>1 km</span>
                        <span>50 km</span>
                    </div>
                </div>

                <div>
                    <label className="label">Additional Details (Optional)</label>
                    <textarea
                        name="description"
                        rows="3"
                        placeholder="Specific requirements, dates needed, etc."
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field"
                        style={{ resize: 'vertical' }}
                    />
                </div>

                <Button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                    {!loading && <Send size={18} style={{ marginLeft: '0.5rem' }} />}
                </Button>
            </form>
        </div>
    );
};

export default ItemRequestForm;
