import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { ArrowRight, Package, ShieldCheck, Zap, Users, Star, Mail, MapPin, Phone } from 'lucide-react';
import Input from '../components/Input';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-gradient)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            color: 'var(--text-main)'
        }}>
            {/* Header / Nav */}
            <header className="glass-panel" style={{
                margin: isMobile ? '1rem' : '1.5rem 3rem',
                padding: isMobile ? '0.75rem 1rem' : '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                animation: 'fadeIn 1s ease-out',
                position: 'relative',
                zIndex: 10,
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(128, 0, 0, 0.05)',
                background: 'rgba(255, 255, 255, 0.8)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: isMobile ? '1.1rem' : '1.5rem', color: 'var(--primary)' }}>
                    <div style={{
                        background: 'var(--primary)',
                        padding: '6px',
                        borderRadius: '10px',
                        display: 'flex',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <Package size={isMobile ? 18 : 24} color="white" />
                    </div>
                    <span>Rent & Return</span>
                </div>
                <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-main)',
                            fontWeight: '600',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        Login
                    </button>
                    <Button
                        onClick={() => navigate('/signup')}
                        style={{
                            borderRadius: 'var(--radius-pill)',
                            boxShadow: 'var(--shadow-md)',
                            padding: isMobile ? '0.6rem 1rem' : '0.75rem 1.5rem',
                            fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                    >
                        Get Started
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <main style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 10,
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div className="animate-fade-in" style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.5rem',
                    background: 'rgba(212, 160, 23, 0.1)',
                    border: '1px solid rgba(212, 160, 23, 0.3)',
                    borderRadius: 'var(--radius-pill)',
                    marginBottom: '2rem',
                    color: 'var(--warning)',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em'
                }}>
                    THE FUTURE OF RENTING
                </div>

                <h1 className="animate-slide-up hero-title">
                    Rent Anything, <br />
                    <span style={{ color: 'var(--secondary)', position: 'relative', display: 'inline-block' }}>
                        Anywhere.
                        <svg style={{ position: 'absolute', bottom: '5px', left: 0, width: '100%', height: '12px', zIndex: -1, opacity: 0.3 }} viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 15 100 5" stroke="var(--secondary)" strokeWidth="8" fill="none" />
                        </svg>
                    </span>
                </h1>

                <p className="animate-slide-up-delay hero-subtitle" style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-muted)',
                    marginBottom: '3rem',
                    maxWidth: '650px',
                    lineHeight: '1.6',
                }}>
                    Experience the premium peer-to-peer marketplace.
                    From high-end cameras to luxury cars, rent verified items securely.
                </p>

                <div className="animate-slide-up-delay hero-buttons" style={{ animationDelay: '0.4s', display: 'flex', gap: '1rem' }}>
                    <Button
                        onClick={() => navigate('/signup')}
                        style={{
                            padding: '0.8rem 2.5rem',
                            fontSize: '1rem',
                            borderRadius: 'var(--radius-pill)',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        Start Renting Now <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </Button>
                    <Button
                        variant="outline"
                        style={{
                            padding: '0.8rem 2.5rem',
                            fontSize: '1rem',
                            borderRadius: 'var(--radius-pill)',
                            borderColor: 'var(--primary)',
                            color: 'var(--primary)'
                        }}
                    >
                        Learn More
                    </Button>
                </div>

                {/* Visual Decorations - Floating Cards */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
                    {/* Floating Circle */}
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '5%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(212, 160, 23, 0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                    }} />

                    {/* Floating Badge Right */}

                </div>
            </main>

            {/* Features Section */}
            <section style={{
                padding: '6rem 2rem',
                position: 'relative',
                zIndex: 10,
                background: 'white'
            }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                    {[
                        { icon: ShieldCheck, title: "Verified & Secure", desc: "Every user is vetted. Rentals are safe with our secure deposit system.", color: "var(--success)" },
                        { icon: Zap, title: "Instant Booking", desc: "Find what you need and book it in seconds. Browse, click, and rent.", color: "var(--secondary)" },
                        { icon: Users, title: "Community Driven", desc: "Connect with verified owners in your area. Support local individuals.", color: "var(--accent)" }
                    ].map((feature, i) => (
                        <div key={i} className="glass-card" style={{ padding: '3rem', textAlign: 'left', border: '1px solid #f3f4f6' }}>
                            <div style={{
                                background: `${feature.color}15`,
                                width: '60px', height: '60px',
                                borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1.5rem',
                                color: feature.color
                            }}>
                                <feature.icon size={32} />
                            </div>
                            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: 'var(--primary)' }}>{feature.title}</h3>
                            <p style={{ fontSize: '1rem' }}>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Maroon Footer Section */}
            <footer style={{
                background: 'var(--primary-hover)', // Deep Maroon background
                color: 'white',
                padding: '4rem 2rem',
                position: 'relative',
                zIndex: 10
            }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr 1fr', gap: '3rem' }}>

                        {/* Column 1: About Us / Branding */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>
                                <span>About Us</span>
                            </div>
                            <p style={{ lineHeight: '1.6', color: 'white', maxWidth: '350px' }}>
                                Rent & Return is Pakistan's premier peer-to-peer rental marketplace.
                                We connect people to rent luxury items securely and affordably.
                                Experience the freedom of access over ownership.
                            </p>
                        </div>

                        {/* Column 2: Quick Links */}
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>Quick Links</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {['Home', 'Search', 'How it Works', 'Safety', 'Terms of Service', 'Privacy Policy'].map((link) => (
                                    <li key={link}>
                                        <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.2s' }}
                                            onMouseOver={(e) => e.target.style.opacity = '1'}
                                            onMouseOut={(e) => e.target.style.opacity = '0.8'}>
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Contact Us */}
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>Contact Us</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Mail size={18} />
                                    <span style={{ opacity: 0.9 }}>rentandreturn.help@gmail.com</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <MapPin size={18} />
                                    <span style={{ opacity: 0.9 }}>Lahore, Pakistan</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Copyright Line */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center', opacity: 0.6, fontSize: '0.9rem' }}>
                        © 2025 Rent & Return. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
