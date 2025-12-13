import { useState } from 'react';

const Input = ({
    type = 'text',
    label,
    id,
    value,
    onChange,
    required = false,
    icon: Icon
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="input-group" style={{ marginBottom: '1.5rem', position: 'relative' }}>
            {label && (
                <label
                    htmlFor={id}
                    style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: 'var(--text-muted)',
                        fontWeight: '500',
                        fontSize: '0.9rem'
                    }}
                >
                    {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                {Icon && (
                    <div style={{
                        position: 'absolute',
                        left: '16px', // Adjusted for larger radius/padding
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: isFocused ? 'var(--primary)' : '#9ca3af',
                        pointerEvents: 'none'
                    }}>
                        <Icon size={20} />
                    </div>
                )}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    required={required}
                    style={{
                        width: '100%',
                        padding: Icon ? '0.875rem 0.875rem 0.875rem 3rem' : '0.875rem 1rem', // Larger padding for premium feel
                        fontSize: '1rem',
                        border: isFocused ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                        borderRadius: '12px', // Curved corners
                        outline: 'none',
                        transition: 'all 0.2s',
                        color: '#1f2937',
                        backgroundColor: '#fff',
                        boxShadow: isFocused ? '0 0 0 3px rgba(128, 0, 0, 0.1)' : 'none'
                    }}
                />
            </div>
        </div>
    );
};

export default Input;
