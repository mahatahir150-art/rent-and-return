import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';

const SplashScreen = ({ className }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={className} style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            background: 'linear-gradient(135deg, #fdfbf7 0%, #fcf8e8 100%)', // Matches new site theme
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            transition: 'opacity 0.5s ease-out',
        }}>
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2.5rem'
            }}>
                {/* Decorative Background Glow */}
                <div style={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 70%)',
                    animation: 'pulse-glow 3s ease-in-out infinite'
                }}></div>

                {/* Rotating Outer Ring - Gold */}
                <div style={{
                    position: 'absolute',
                    width: '140px',
                    height: '140px',
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderTopColor: 'var(--secondary)', // Gold
                    borderRightColor: 'var(--secondary)',
                    animation: 'spin 3s cubic-bezier(0.5, 0, 0.5, 1) infinite'
                }}></div>

                {/* Rotating Inner Ring - Maroon */}
                <div style={{
                    position: 'absolute',
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderBottomColor: 'var(--primary)', // Maroon
                    borderLeftColor: 'var(--primary)',
                    animation: 'spin 2s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse'
                }}></div>

                {/* Center Logo Container */}
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'white',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(128, 0, 0, 0.15)', // Soft maroon shadow
                    transform: mounted ? 'scale(1)' : 'scale(0.8)',
                    opacity: mounted ? 1 : 0,
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    position: 'relative',
                    zIndex: 10
                }}>
                    {/* RR Monogram */}
                    <div style={{
                        fontFamily: '"Playfair Display", serif', // Or fallback to serif
                        fontWeight: '900',
                        fontSize: '2.5rem',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.05em'
                    }}>
                        RR
                    </div>
                </div>
            </div>

            {/* Text Content */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                opacity: mounted ? 1 : 0,
                transition: 'all 0.8s ease-out 0.3s'
            }}>
                <h1 style={{
                    fontSize: '3rem', // Larger
                    fontWeight: '800',
                    color: 'var(--primary)',
                    letterSpacing: '-0.02em',
                    margin: 0,
                    marginBottom: '0.5rem'
                }}>Rent & Return</h1>

                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.1rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: '500'
                }}>Premium Marketplace</p>

                {/* Loading Line */}
                <div style={{
                    width: '60px',
                    height: '3px',
                    background: 'rgba(128, 0, 0, 0.1)',
                    marginTop: '2rem',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: '50%',
                        background: 'var(--secondary)',
                        animation: 'loading-bar 1.5s ease-in-out infinite'
                    }}></div>
                </div>
            </div>

            <style>
                {`
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                    @keyframes pulse-glow {
                        0%, 100% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.2); opacity: 0.8; }
                    }
                    @keyframes loading-bar {
                        0% { left: -50%; }
                        100% { left: 100%; }
                    }
                `}
            </style>
        </div>
    );
};

export default SplashScreen;
