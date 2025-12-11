import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Camera, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleAutoFill = () => {
        alert('Camera opened for ID scanning (Simulated). Auto-filling details...');
        setFormData({
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            password: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate OTP
        const otp = prompt('Enter OTP sent to your phone (Enter 1234):');
        if (otp === '1234') {
            console.log('Signup success:', formData);
            navigate('/dashboard');
        } else {
            alert('Invalid OTP');
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
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Join the Rent & Return community today.</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <Button
                        variant="outline"
                        onClick={handleAutoFill}
                        icon={Camera}
                    >
                        Auto-fill from ID Picture
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        id="fullName"
                        type="text"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        icon={User}
                        required
                    />

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
                        id="phone"
                        type="tel"
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        icon={Phone}
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

                    <Button type="submit" style={{ marginTop: '1rem' }} icon={ArrowRight}>
                        Sign Up
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
