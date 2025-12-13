import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import Input from '../components/Input';
import Button from '../components/Button';
import { validateEmail, checkRateLimit } from '../utils/authUtils';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError(''); // Clear error on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Check rate limiting
        const rateLimit = checkRateLimit('login', 5, 15 * 60 * 1000);
        if (!rateLimit.allowed) {
            setError(rateLimit.message);
            setIsLoading(false);
            return;
        }

        // Validate email
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            setError(emailValidation.message);
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setIsLoading(false);
            return;
        }

        try {
            // Sign in with Firebase Authentication
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log('Login successful');
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);

            // Handle Firebase auth errors with user-friendly messages
            switch (error.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email address. Please sign up first.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address format.');
                    break;
                case 'auth/user-disabled':
                    setError('This account has been disabled. Please contact support.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many failed login attempts. Please try again later or reset your password.');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid email or password. Please check your credentials and try again.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Please check your internet connection and try again.');
                    break;
                default:
                    setError('Login failed. Please check your credentials and try again.');
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
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
            <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>Rent & Return</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back! Please login to continue.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            background: '#fee2e2',
                            color: '#ef4444',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                            border: '1px solid #fecaca'
                        }}>
                            {error}
                        </div>
                    )}

                    <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        icon={Mail}
                        required
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        icon={Lock}
                        required
                    />

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                        <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem' }}>
                            Forgot Password?
                        </a>
                    </div>

                    <Button type="submit" style={{ marginBottom: '1rem' }} icon={ArrowRight} disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
