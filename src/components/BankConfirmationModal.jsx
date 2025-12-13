import { useState, useEffect } from 'react';
import { X, Loader, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { getUserBankDetails } from '../utils/firebaseBankingUtils';
import Button from './Button';
import Input from './Input';

const BankConfirmationModal = ({ isOpen, onClose, type, onConfirm }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState(null);
    const [bankDetails, setBankDetails] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const loadBankDetails = async () => {
                const details = await getUserBankDetails();
                setBankDetails(details);
            };
            loadBankDetails();
            setAmount('');
            setError('');
            setResult(null);
            setIsProcessing(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const amountNum = parseFloat(amount);
        if (!amountNum || amountNum <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setError('');
        setIsProcessing(true);

        try {
            const transactionResult = await onConfirm(amountNum);
            setResult(transactionResult);
        } catch (err) {
            setResult({
                success: false,
                message: 'Transaction failed. Please try again.'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setAmount('');
        setError('');
        setResult(null);
        setIsProcessing(false);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }} onClick={handleClose}>
            <div
                className="card glass animate-fade-in"
                style={{
                    maxWidth: '500px',
                    width: '100%',
                    position: 'relative',
                    animation: 'slideUp 0.3s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'var(--bg-secondary)';
                        e.target.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = 'var(--text-muted)';
                    }}
                >
                    <X size={20} />
                </button>

                {/* Processing State */}
                {isProcessing && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            borderRadius: '50%',
                            marginBottom: '1.5rem',
                            animation: 'pulse 2s infinite'
                        }}>
                            <Loader size={48} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                        <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Processing with Bank...</h2>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Please wait while we confirm your {type} with the bank.
                        </p>
                    </div>
                )}

                {/* Result State */}
                {result && !isProcessing && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{
                            display: 'inline-flex',
                            padding: '1.5rem',
                            background: result.success
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : 'linear-gradient(135deg, #ef4444, #dc2626)',
                            borderRadius: '50%',
                            marginBottom: '1.5rem'
                        }}>
                            {result.success ? (
                                <CheckCircle size={48} color="white" />
                            ) : (
                                <AlertCircle size={48} color="white" />
                            )}
                        </div>
                        <h2 style={{
                            color: result.success ? 'var(--success)' : '#ef4444',
                            marginBottom: '1rem'
                        }}>
                            {result.success ? 'Transaction Successful!' : 'Transaction Failed'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            {result.message}
                        </p>

                        {result.success && (
                            <div style={{
                                background: 'var(--bg-secondary)',
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1.5rem',
                                textAlign: 'left'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.75rem',
                                    paddingBottom: '0.75rem',
                                    borderBottom: '1px solid var(--border)'
                                }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Amount</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--text)' }}>
                                        Rs. {result.amount?.toLocaleString()}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.75rem',
                                    paddingBottom: '0.75rem',
                                    borderBottom: '1px solid var(--border)'
                                }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
                                    <span style={{
                                        fontWeight: 'bold',
                                        color: 'var(--primary)',
                                        fontSize: '0.875rem'
                                    }}>
                                        {result.transactionId}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{ color: 'var(--text-muted)' }}>New Balance</span>
                                    <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>
                                        Rs. {result.newBalance?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}

                        <Button onClick={handleClose} style={{ width: '100%' }}>
                            {result.success ? 'Done' : 'Try Again'}
                        </Button>
                    </div>
                )}

                {/* Input Form State */}
                {!isProcessing && !result && (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                display: 'inline-flex',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                borderRadius: '50%',
                                marginBottom: '1rem'
                            }}>
                                <CreditCard size={32} color="white" />
                            </div>
                            <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                {type === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                Enter the amount you want to {type}
                            </p>
                        </div>

                        {/* Bank Account Info */}
                        {bankDetails && (
                            <div style={{
                                background: 'var(--bg-secondary)',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1.5rem'
                            }}>
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {type === 'deposit' ? 'Depositing to' : 'Withdrawing from'}
                                </p>
                                <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                    {bankDetails.accountHolderName}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {bankDetails.bankName}
                                </p>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-muted)',
                                    fontFamily: 'monospace'
                                }}>
                                    {bankDetails.accountNumber}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div style={{
                                    background: '#fee2e2',
                                    color: '#ef4444',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: 'var(--text)',
                                    fontWeight: '600'
                                }}>
                                    Amount (PKR)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    min="1"
                                    step="1"
                                    required
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem',
                                        border: '2px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '1.125rem',
                                        fontWeight: 'bold',
                                        background: 'var(--bg)',
                                        color: 'var(--text)',
                                        transition: 'all 0.2s',
                                        outline: 'none'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'var(--primary)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'var(--border)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleClose}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    style={{ flex: 1 }}
                                >
                                    {type === 'deposit' ? 'Deposit' : 'Withdraw'}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default BankConfirmationModal;
