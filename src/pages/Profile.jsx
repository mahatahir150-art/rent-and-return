import { useState, useEffect, useRef } from 'react';
import { User, Mail, MapPin, Calendar, Edit, Camera, Save, X } from 'lucide-react';
import Button from '../components/Button';
import { auth, realtimeDb as db, storage } from '../config/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref as dbRef, get, update } from 'firebase/database';
import { uploadToCloudinary } from '../utils/cloudinary';
import toast from 'react-hot-toast';

const Profile = () => {
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        joinDate: '',
        verified: false,
        rating: 0,
        reviews: 0,
        listings: 0,
        rentals: 0,
        photoURL: ''
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userRef = dbRef(db, `users/${user.uid}`);
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setUserData({
                            name: data.fullName || user.displayName || 'User',
                            email: user.email,
                            photoURL: data.photoURL || user.photoURL,
                            phone: data.phone || '',
                            location: data.address || '',
                            joinDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A',
                            verified: data.emailVerified || user.emailVerified,
                            rating: data.rating || 0,
                            reviews: data.reviewsCount || 0,
                            listings: data.listingsCount || 0,
                            rentals: data.rentalsCount || 0
                        });
                    } else {
                        setUserData({
                            name: user.displayName || 'User',
                            email: user.email,
                            photoURL: user.photoURL,
                            joinDate: new Date(user.metadata.creationTime).toLocaleDateString(),
                            verified: user.emailVerified,
                            rating: 0, reviews: 0, listings: 0, rentals: 0
                        });
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const user = auth.currentUser;
        if (!user) {
            toast.error("Please log in to update your profile.");
            return;
        }

        setUploading(true);
        try {
            // Upload to Cloudinary
            const photoURL = await uploadToCloudinary(file);
            console.log("Cloudinary Upload Success:", photoURL);

            // Update Auth Profile
            await updateProfile(user, { photoURL });

            // Update Database
            await update(dbRef(db, `users/${user.uid}`), {
                photoURL: photoURL
            });

            // Update Local State
            setUserData(prev => ({ ...prev, photoURL }));
            toast.success("Profile picture updated successfully!");

        } catch (error) {
            console.error("Profile Upload Error:", error);
            toast.error(`Failed to upload image: ${error.message}`);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await update(dbRef(db, `users/${user.uid}`), {
                fullName: userData.name,
                phone: userData.phone,
                address: userData.location,
            });
            setIsEditing(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save changes. Please try again.");
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Left Column: Avatar & Stats */}
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                    {/* Wrapper for Avatar + Button */}
                    <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1rem' }}>

                        {/* Avatar Container (Clipped) */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            background: '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {userData.photoURL ? (
                                <img
                                    src={`${userData.photoURL}${userData.photoURL.includes('?') ? '&' : '?'}t=${Date.now()}`}
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : null}
                            <div style={{ display: userData.photoURL ? 'none' : 'block' }}>
                                <User size={64} color="var(--text-muted)" />
                            </div>
                        </div>

                        {/* Camera Button (Floating on top) */}
                        <button
                            type="button"
                            onClick={() => {
                                console.log("Camera button clicked!");
                                fileInputRef.current?.click();
                            }}
                            style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                background: uploading ? '#ccc' : 'var(--primary)',
                                color: 'white',
                                border: '4px solid white', // Adds a nice border to separate from avatar
                                borderRadius: '50%',
                                width: '40px', // Slightly larger hit area
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: uploading ? 'wait' : 'pointer',
                                padding: 0,
                                zIndex: 10,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title="Upload Profile Picture"
                        >
                            <Camera size={18} />
                        </button>

                        <input
                            type="file"
                            id="photo-upload"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            disabled={uploading}
                            ref={fileInputRef}
                        />
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{userData.name}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{userData.location || 'No address set'}</p>

                    {userData.verified && (
                        <div style={{
                            background: 'rgba(34, 139, 34, 0.1)',
                            color: 'var(--success)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem'
                        }}>
                            Verified Member
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{userData.listings}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Listings</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{userData.rating}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rating</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>{userData.rentals}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rentals</div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Personal Information Form */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>Personal Information</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Full Name */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                                <User size={20} color="var(--primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="label">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="input-field" style={{ background: '#f8fafc', border: '1px solid transparent' }}>{userData.name}</div>
                                )}
                            </div>
                        </div>

                        {/* Email Address */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                                <Mail size={20} color="var(--primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="label">Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        disabled // Email editing disabled for now
                                        className="input-field"
                                        style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                                    />
                                ) : (
                                    <div className="input-field" style={{ background: '#f8fafc', border: '1px solid transparent' }}>{userData.email}</div>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {/* Added Phone field which was missing in original read-only view but present in data structure */}
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                                <MapPin size={20} color="var(--primary)" /> {/* Reusing Icon or should be Phone? Using MapPin for now to match layout, but Phone is better */}
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="label">Phone</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="input-field" style={{ background: '#f8fafc', border: '1px solid transparent' }}>{userData.phone || 'Not provided'}</div>
                                )}
                            </div>
                        </div>


                        {/* Join Date (Read Only) */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                                <Calendar size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <label>Joined</label>
                                <div style={{ fontWeight: '500' }}>{userData.joinDate}</div>
                            </div>
                        </div>

                        {/* Location */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                                <MapPin size={20} color="var(--primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label className="label">Address</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={userData.location}
                                        onChange={handleInputChange}
                                        className="input-field"
                                    />
                                ) : (
                                    <div className="input-field" style={{ background: '#f8fafc', border: '1px solid transparent' }}>{userData.location || 'Not provided'}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} style={{ flex: 1 }}>
                                    <Save size={16} style={{ marginRight: '0.5rem' }} />
                                    Save Changes
                                </Button>
                                <Button variant="outline" onClick={() => setIsEditing(false)} style={{ flex: 1, color: 'var(--text-muted)', borderColor: 'var(--text-muted)' }}>
                                    <X size={16} style={{ marginRight: '0.5rem' }} />
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} style={{ width: '100%' }}>
                                <Edit size={16} style={{ marginRight: '0.5rem' }} />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Profile;
