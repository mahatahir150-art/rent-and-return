// Realtime Database banking utility functions for managing user bank details and transactions

import { realtimeDb as db, auth } from '../config/firebase';
import { ref, set, get, push, query, orderByChild, limitToLast } from 'firebase/database';

// Pakistani banks list
export const PAKISTANI_BANKS = [
    'HBL - Habib Bank Limited',
    'UBL - United Bank Limited',
    'MCB - Muslim Commercial Bank',
    'ABL - Allied Bank Limited',
    'NBP - National Bank of Pakistan',
    'Meezan Bank',
    'Bank Alfalah',
    'Faysal Bank',
    'Standard Chartered Bank',
    'JS Bank',
    'Askari Bank',
    'Bank Al Habib',
    'Soneri Bank',
    'Silk Bank',
    'Summit Bank'
];

/**
 * Get user's banking details from Realtime Database
 * @returns {Object|null} Banking details or null if not found
 */
export const getUserBankDetails = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log('No authenticated user');
            return null;
        }

        const bankDetailsRef = ref(db, `users/${user.uid}/banking/details`);
        const snapshot = await get(bankDetailsRef);

        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error('Error retrieving bank details:', error);
        return null;
    }
};

/**
 * Check if user has completed banking details setup
 * @returns {boolean} True if banking details are complete
 */
export const hasBankingDetails = async () => {
    const details = await getUserBankDetails();
    return details && details.bankName && details.accountNumber && details.accountHolderName;
};

/**
 * Save user's banking details to Realtime Database
 * @param {Object} details - Banking details object
 */
export const saveUserBankDetails = async (details) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('No authenticated user');
            return false;
        }

        const bankDetailsRef = ref(db, `users/${user.uid}/banking/details`);
        await set(bankDetailsRef, {
            ...details,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error saving bank details:', error);
        return false;
    }
};

/**
 * Generate a unique transaction ID
 */
export const generateTransactionId = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TXN-${dateStr}-${random}`;
};

/**
 * Get current balance from Realtime Database
 */
export const getBalance = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log('No authenticated user');
            return 50000;
        }

        const balanceRef = ref(db, `users/${user.uid}/banking/balance`);
        const snapshot = await get(balanceRef);

        if (snapshot.exists()) {
            return snapshot.val().amount || 50000;
        }

        // Initialize balance if it doesn't exist
        await set(balanceRef, {
            amount: 50000,
            updatedAt: new Date().toISOString()
        });
        return 50000;
    } catch (error) {
        console.error('Error retrieving balance:', error);
        return 50000;
    }
};

/**
 * Update balance in Realtime Database
 */
export const updateBalance = async (newBalance) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('No authenticated user');
            return false;
        }

        const balanceRef = ref(db, `users/${user.uid}/banking/balance`);
        await set(balanceRef, {
            amount: newBalance,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error updating balance:', error);
        return false;
    }
};

/**
 * Save a transaction to Realtime Database
 */
export const saveTransaction = async (transaction) => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('No authenticated user');
            return false;
        }

        const transactionsRef = ref(db, `users/${user.uid}/transactions`);
        const newTransactionRef = push(transactionsRef);

        await set(newTransactionRef, {
            ...transaction,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        });
        return true;
    } catch (error) {
        console.error('Error saving transaction:', error);
        return false;
    }
};

/**
 * Get all transactions from Realtime Database
 */
export const getTransactions = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.log('No authenticated user');
            return [];
        }

        const transactionsRef = ref(db, `users/${user.uid}/transactions`);
        const snapshot = await get(transactionsRef);

        if (snapshot.exists()) {
            const transactionsObj = snapshot.val();
            // Convert object to array and sort by timestamp (newest first)
            const transactions = Object.keys(transactionsObj).map(key => ({
                id: key,
                ...transactionsObj[key]
            }));

            transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            return transactions;
        }

        return [];
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        return [];
    }
};

/**
 * Simulate bank confirmation API call
 */
export const simulateBankConfirmation = (amount, type) => {
    return new Promise((resolve, reject) => {
        const delay = 2000 + Math.random() * 1000;

        setTimeout(() => {
            const isSuccess = Math.random() > 0.05;

            if (isSuccess) {
                const transactionId = generateTransactionId();
                resolve({
                    success: true,
                    transactionId,
                    amount,
                    type,
                    status: 'Confirmed by Bank',
                    message: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} of Rs. ${amount.toLocaleString()} confirmed by bank.`
                });
            } else {
                reject({
                    success: false,
                    message: 'Bank confirmation failed. Please try again later.',
                    error: 'BANK_TIMEOUT'
                });
            }
        }, delay);
    });
};

/**
 * Process a deposit transaction
 */
export const processDeposit = async (amount) => {
    try {
        const result = await simulateBankConfirmation(amount, 'deposit');

        const currentBalance = await getBalance();
        const newBalance = currentBalance + amount;
        await updateBalance(newBalance);

        await saveTransaction({
            type: 'deposit',
            amount,
            status: result.status,
            transactionId: result.transactionId
        });

        return {
            success: true,
            ...result,
            newBalance
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Deposit failed'
        };
    }
};

/**
 * Process a withdrawal transaction
 */
export const processWithdrawal = async (amount) => {
    try {
        const currentBalance = await getBalance();

        if (amount > currentBalance) {
            return {
                success: false,
                message: 'Insufficient funds in your account.'
            };
        }

        const result = await simulateBankConfirmation(amount, 'withdrawal');

        const newBalance = currentBalance - amount;
        await updateBalance(newBalance);

        await saveTransaction({
            type: 'withdrawal',
            amount,
            status: result.status,
            transactionId: result.transactionId
        });

        return {
            success: true,
            ...result,
            newBalance
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || 'Withdrawal failed'
        };
    }
};
