import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Camera, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, realtimeDb as db } from '../config/firebase';
import Input from '../components/Input';
import PhoneInput from '../components/PhoneInput';
import Button from '../components/Button';
import { validatePhoneNumber, validateEmail, validatePassword, validateFullName, checkRateLimit } from '../utils/authUtils';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Form, 2: Email Sent Success
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Clear any previous artifacts on mount
    useEffect(() => {
        setStep(1);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        const nameValidation = validateFullName(formData.fullName);
        if (!nameValidation.isValid) return setError(nameValidation.message) || setIsLoading(false);

        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) return setError(emailValidation.message) || setIsLoading(false);

        const phoneValidation = validatePhoneNumber(formData.phone);
        if (!phoneValidation.isValid) return setError(phoneValidation.message) || setIsLoading(false);

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) return setError(passwordValidation.message) || setIsLoading(false);

        try {
            // 1. Create API Account
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. Update Profile Name
            await updateProfile(user, { displayName: formData.fullName });

            // 3. Save to Realtime Database
            await set(ref(db, `users/${user.uid}`), {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone, // Stored as profile info only
                emailVerified: false,
                createdAt: new Date().toISOString()
            });

            // 4. Initialize Balance
            await set(ref(db, `users/${user.uid}/banking/balance`), {
                amount: 50000,
                updatedAt: new Date().toISOString()
            });

            // 5. Send Verification Email
            await sendEmailVerification(user);

            // 6. Show Success Screen
            setStep(2);
            setIsLoading(false);

        } catch (error) {
            console.error("Signup Error:", error);
            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please login.');
            } else if (error.code === 'auth/weak-password') {
                setError('Password is too weak.');
            } else {
                setError(error.message);
            }
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            padding: '1rem'
        }}>
            <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '450px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {step === 1 ? 'Create Account' : 'Check Your Email'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {step === 1 ? 'Join Rent & Return today.' : 'We sent a verification link.'}
                    </p>
                </div>

                {step === 1 ? (
                    /* FORM STEP */
                    <>
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div style={{
                                    background: '#fee2e2',
                                    color: '#ef4444',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem'
                                }}>{error}</div>
                            )}

                            <Input id="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} icon={User} required />
                            <Input id="email" type="email" label="Email Address" value={formData.email} onChange={handleChange} icon={Mail} required />
                            <PhoneInput label="Phone Number" value={formData.phone} onChange={handleChange} required />
                            <Input id="password" type="password" label="Password" value={formData.password} onChange={handleChange} icon={Lock} required />

                            <div style={{ marginBottom: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Password must have 8+ chars, 1 uppercase, 1 symbol.
                            </div>

                            <Button type="submit" style={{ marginTop: '1rem' }} icon={ArrowRight} disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </Button>
                        </form>
                    </>
                ) : (
                    /* SUCCESS STEP */
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <CheckCircle size={64} color="var(--success)" />
                        </div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Verification Email Sent!</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            We have sent a confirmation link to <strong>{formData.email}</strong>.<br />
                            Please check your inbox (and spam folder) and click the link to activate your account.
                        </p>

                        <Button onClick={() => navigate('/login')} icon={ArrowRight}>
                            Go to Login
                        </Button>

                        <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Did not receive it? </span>
                            <button
                                onClick={() => {
                                    alert("If you haven't verified yet, try logging in, and we can resend it.");
                                    navigate('/login');
                                }}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Resend Link
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                            Login
                        </Link>
                    </p>
                </div>
            </div >
        </div >
    );
};

export default Signup;
