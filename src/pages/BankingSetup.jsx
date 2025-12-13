import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, CreditCard, User, ArrowRight, CheckCircle } from 'lucide-react';
import { auth } from '../config/firebase';
import Input from '../components/Input';
import Button from '../components/Button';
import { PAKISTANI_BANKS, saveUserBankDetails, getUserBankDetails } from '../utils/firebaseBankingUtils';
import { validateAccountNumber, validateIBAN, validateAccountHolderName } from '../utils/validationUtils';

const BankingSetup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        bankName: '',
        accountHolderName: '',
        accountNumber: '',
        iban: ''
    });

    const [error, setError] = useState('');
    const [warning, setWarning] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userFullName, setUserFullName] = useState('');

    // Get return URL from location state (for redirecting back after setup)
    const returnUrl = location.state?.returnUrl || '/dashboard/bank';

    useEffect(() => {
        // Get user's full name for validation
        const user = auth.currentUser;
        if (user) {
            setUserFullName(user.displayName || '');

            // Pre-fill account holder name with user's name
            setFormData(prev => ({
                ...prev,
                accountHolderName: user.displayName || ''
            }));
        }

        // Check if banking details already exist
        const checkExistingDetails = async () => {
            const existingDetails = await getUserBankDetails();
            if (existingDetails) {
                setFormData({
                    bankName: existingDetails.bankName || '',
                    accountHolderName: existingDetails.accountHolderName || '',
                    accountNumber: existingDetails.accountNumber || '',
                    iban: existingDetails.iban || ''
                });
            }
        };
        checkExistingDetails();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
        setWarning('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setWarning('');
        setIsLoading(true);

        // Validate bank name
        if (!formData.bankName) {
            setError('Please select your bank');
            setIsLoading(false);
            return;
        }

        // Validate account holder name
        const nameValidation = validateAccountHolderName(formData.accountHolderName, userFullName);
        if (!nameValidation.isValid) {
            setError(nameValidation.message);
            setIsLoading(false);
            return;
        }
        if (nameValidation.warning) {
            setWarning(nameValidation.warning);
        }

        // Validate account number
        const accountValidation = validateAccountNumber(formData.accountNumber, formData.bankName);
        if (!accountValidation.isValid) {
            setError(accountValidation.message);
            setIsLoading(false);
            return;
        }

        // Validate IBAN (optional)
        const ibanValidation = validateIBAN(formData.iban);
        if (!ibanValidation.isValid) {
            setError(ibanValidation.message);
            setIsLoading(false);
            return;
        }

        try {
            // Save banking details to Firebase
            const success = await saveUserBankDetails({
                bankName: formData.bankName,
                accountHolderName: nameValidation.formatted,
                accountNumber: accountValidation.formatted,
                iban: ibanValidation.formatted || ''
            });

            if (success) {
                // Redirect to return URL or bank page
                navigate(returnUrl, { replace: true });
            } else {
                setError('Failed to save banking details. Please try again.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error saving banking details:', error);
            setError('An error occurred. Please try again.');
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
            padding: '2rem'
        }}>
            <div className="card glass animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Building2 size={40} color="white" />
                    </div>
                    <h1 style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>
                        Banking Details Setup
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Please provide your banking details to enable deposits, withdrawals, and product rentals.
                    </p>
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

                    {warning && (
                        <div style={{
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            marginBottom: '1rem',
                            fontSize: '0.875rem',
                            border: '1px solid #fde68a'
                        }}>
                            ⚠️ {warning}
                        </div>
                    )}

                    {/* Bank Name Dropdown */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: 'var(--text-main)',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            Bank Name *
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Building2 size={20} style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} />
                            <select
                                id="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 3rem',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: 'var(--radius-md)',
                                    fontSize: '1rem',
                                    background: 'white',
                                    color: 'var(--text-main)',
                                    transition: 'all 0.2s',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--primary)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(128, 0, 0, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <option value="">Select your bank</option>
                                {PAKISTANI_BANKS.map(bank => (
                                    <option key={bank} value={bank}>{bank}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Input
                        id="accountHolderName"
                        type="text"
                        label="Account Holder Name"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        icon={User}
                        required
                        placeholder="Enter name as per bank account"
                    />

                    <Input
                        id="accountNumber"
                        type="text"
                        label="Account Number"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        icon={CreditCard}
                        required
                        placeholder="Enter your account number"
                    />

                    <Input
                        id="iban"
                        type="text"
                        label="IBAN (Optional)"
                        value={formData.iban}
                        onChange={handleChange}
                        icon={CreditCard}
                        placeholder="PK36SCBL0000001123456702"
                    />

                    <div style={{
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem',
                        color: '#0369a1'
                    }}>
                        <CheckCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Your banking information is securely encrypted and stored.
                    </div>

                    <Button type="submit" icon={ArrowRight} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Banking Details'}
                    </Button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            textDecoration: 'underline'
                        }}
                    >
                        Skip for now (you can add this later)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BankingSetup;
