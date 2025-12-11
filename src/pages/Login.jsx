import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Fingerprint, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual auth logic
        console.log('Login attempt:', formData);
        navigate('/dashboard');
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

                    <Button type="submit" style={{ marginBottom: '1rem' }} icon={ArrowRight}>
                        Login
                    </Button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    </div>

                    <Button
                        variant="outline"
                        type="button"
                        icon={Fingerprint}
                        onClick={() => alert('Biometric Login simulated!')}
                        style={{ marginBottom: '1.5rem' }}
                    >
                        Biometric Login
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
