import { useState } from 'react';
import { Phone } from 'lucide-react';

const countryCodes = [
    { code: '+92', country: 'PK', flag: '🇵🇰' },
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+971', country: 'AE', flag: '🇦🇪' },
];

const PhoneInput = ({ value, onChange, label, required }) => {
    // Split value into code and number if possible, or default
    // We assume value is stored as full string e.g. "+92300..."

    // Simple logic to find prefix, default to PK (+92)
    const initialCode = countryCodes.find(c => value.startsWith(c.code))?.code || '+92';
    const initialNumber = value.startsWith(initialCode) ? value.slice(initialCode.length) : value;

    const [selectedCode, setSelectedCode] = useState(initialCode);
    const [number, setNumber] = useState(initialNumber);
    const [isFocused, setIsFocused] = useState(false);

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setSelectedCode(newCode);
        onChange({ target: { id: 'phone', value: `${newCode}${number}` } }); // Synthetic event
    };

    const handleNumberChange = (e) => {
        const newNumber = e.target.value;
        setNumber(newNumber);
        onChange({ target: { id: 'phone', value: `${selectedCode}${newNumber}` } });
    };

    return (
        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: 'var(--text-muted)',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                }}>
                    {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
                </label>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {/* Country Code Select */}
                <div style={{ position: 'relative', width: '100px' }}>
                    <select
                        value={selectedCode}
                        onChange={handleCodeChange}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '1rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: 'var(--radius-sm)',
                            outline: 'none',
                            backgroundColor: '#f8fafc',
                            cursor: 'pointer',
                            appearance: 'none', // Remove default arrow for custom look if needed, but keeping simple for now
                            color: '#1f2937'
                        }}
                    >
                        {countryCodes.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.flag} {c.code}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Phone Number Input */}
                <div style={{ position: 'relative', flex: 1 }}>
                    <div style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: isFocused ? 'var(--primary)' : '#9ca3af',
                        pointerEvents: 'none'
                    }}>
                        <Phone size={20} />
                    </div>
                    <input
                        type="tel"
                        value={number}
                        onChange={handleNumberChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="3001234567"
                        style={{
                            width: '100%',
                            padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                            fontSize: '1rem',
                            border: isFocused ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                            borderRadius: 'var(--radius-sm)',
                            outline: 'none',
                            transition: 'all 0.2s',
                            color: '#1f2937',
                            backgroundColor: '#fff',
                            boxShadow: isFocused ? '0 0 0 3px rgba(128, 0, 0, 0.1)' : 'none'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PhoneInput;
