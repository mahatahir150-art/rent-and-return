
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import BankConfirmationModal from '../components/BankConfirmationModal';
import { getBalance, getTransactions, processDeposit, processWithdrawal, hasBankingDetails } from '../utils/firebaseBankingUtils';

const Bank = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [modalState, setModalState] = useState({ isOpen: false, type: null });
    const [hasBanking, setHasBanking] = useState(false);
    const [isCheckingBanking, setIsCheckingBanking] = useState(true);

    useEffect(() => {
        // Check if user has banking details
        const checkBankingDetails = async () => {
            const hasDetails = await hasBankingDetails();
            setHasBanking(hasDetails);
            setIsCheckingBanking(false);

            if (!hasDetails) {
                // Show prompt to setup banking details
                return;
            }

            // Load balance and transactions from Firebase only if banking details exist
            const balanceData = await getBalance();
            const transactionsData = await getTransactions();
            setBalance(balanceData);
            setTransactions(transactionsData);
        };
        checkBankingDetails();
    }, []);

    const handleOpenModal = (type) => {
        setModalState({ isOpen: true, type });
    };

    const handleCloseModal = async () => {
        setModalState({ isOpen: false, type: null });
        // Refresh balance and transactions after modal closes
        const balanceData = await getBalance();
        const transactionsData = await getTransactions();
        setBalance(balanceData);
        setTransactions(transactionsData);
    };

    const handleConfirmTransaction = async (amount) => {
        if (modalState.type === 'deposit') {
            return await processDeposit(amount);
        } else {
            return await processWithdrawal(amount);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Banking Setup Required Prompt */}
            {!isCheckingBanking && !hasBanking && (
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '2px solid #f59e0b',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <AlertCircle size={48} style={{ color: '#d97706', marginBottom: '1rem' }} />
                    <h3 style={{ color: '#92400e', marginBottom: '1rem' }}>Banking Details Required</h3>
                    <p style={{ color: '#78350f', marginBottom: '1.5rem' }}>
                        Please set up your banking details to enable deposits, withdrawals, and product rentals.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/banking-setup', { state: { returnUrl: '/dashboard/bank' } })}
                        style={{
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#d97706'}
                        onMouseLeave={(e) => e.target.style.background = '#f59e0b'}
                    >
                        Setup Banking Details
                    </button>
                </div>
            )}

            {/* Balance Card */}
            <div className="card" style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white',
                marginBottom: '2rem',
                padding: '2.5rem',
                opacity: hasBanking ? 1 : 0.5,
                pointerEvents: hasBanking ? 'auto' : 'none'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Total Balance</p>
                        <h2 style={{ fontSize: '3rem', color: 'white' }}>Rs. {balance.toLocaleString()}</h2>
                    </div>
                    <Wallet size={48} style={{ opacity: 0.5 }} />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => handleOpenModal('deposit')} style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        <ArrowDownLeft /> Deposit
                    </button>
                    <button onClick={() => handleOpenModal('withdrawal')} style={{
                        flex: 1,
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        <ArrowUpRight /> Withdraw
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            <h3 style={{ marginBottom: '1rem' }}>Recent Transactions</h3>
            <div className="card">
                {transactions.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: 'var(--text-muted)'
                    }}>
                        <CreditCard size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p>No transactions yet</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                            Start by making a deposit or withdrawal
                        </p>
                    </div>
                ) : (
                    transactions.map((transaction, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem 0',
                            borderBottom: index < transactions.length - 1 ? '1px solid #e2e8f0' : 'none'
                        }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    background: transaction.type === 'deposit'
                                        ? 'rgba(16, 185, 129, 0.1)'
                                        : 'rgba(239, 68, 68, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: '50%',
                                    color: transaction.type === 'deposit' ? 'var(--success)' : '#ef4444'
                                }}>
                                    {transaction.type === 'deposit' ? (
                                        <TrendingUp size={20} />
                                    ) : (
                                        <TrendingDown size={20} />
                                    )}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                        {transaction.type === 'deposit' ? 'Deposit to Wallet' : 'Withdrawal from Wallet'}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                        {transaction.date}
                                    </p>
                                    <div style={{
                                        display: 'inline-block',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: 'var(--success)',
                                        padding: '0.125rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {transaction.status}
                                    </div>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)',
                                        fontFamily: 'monospace',
                                        marginTop: '0.25rem'
                                    }}>
                                        ID: {transaction.transactionId}
                                    </p>
                                </div>
                            </div>
                            <span style={{
                                color: transaction.type === 'deposit' ? 'var(--success)' : '#ef4444',
                                fontWeight: 'bold',
                                fontSize: '1.125rem'
                            }}>
                                {transaction.type === 'deposit' ? '+' : '-'} Rs. {transaction.amount.toLocaleString()}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Bank Confirmation Modal */}
            <BankConfirmationModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                type={modalState.type}
                onConfirm={handleConfirmTransaction}
            />
        </div>
    );
};

export default Bank;
