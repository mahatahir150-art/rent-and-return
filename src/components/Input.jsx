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
    const hasValue = value && value.length > 0;

    return (
        <div className="input-group">
            <div style={{ position: 'relative' }}>
                {Icon && (
                    <div style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        zIndex: 1
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
                    className="input-field"
                    required={required}
                    style={{ paddingLeft: Icon ? '40px' : '1rem' }}
                />
                {label && (
                    <label
                        htmlFor={id}
                        style={{
                            position: 'absolute',
                            left: Icon ? '40px' : '1rem',
                            top: isFocused || hasValue ? '0' : '50%',
                            transform: isFocused || hasValue ? 'translateY(-26px)' : 'translateY(-50%)',
                            background: isFocused || hasValue ? 'transparent' : 'transparent',
                            fontSize: isFocused || hasValue ? '0.875rem' : '1rem',
                            color: isFocused ? 'var(--primary)' : 'var(--text-muted)',
                            pointerEvents: 'none',
                            transition: 'all 0.2s ease',
                            fontWeight: isFocused || hasValue ? '600' : '400'
                        }}
                    >
                        {label}
                        {required && <span style={{ color: 'var(--error)', marginLeft: '4px' }}>*</span>}
                    </label>
                )}
            </div>
        </div>
    );
};

export default Input;
