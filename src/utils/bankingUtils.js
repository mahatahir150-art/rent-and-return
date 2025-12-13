// Banking utility functions for managing user bank details and transactions

const STORAGE_KEYS = {
    BANK_DETAILS: 'rent_return_bank_details',
    TRANSACTIONS: 'rent_return_transactions',
    BALANCE: 'rent_return_balance'
};

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
 * Get user's banking details from localStorage
 * @returns {Object|null} Banking details or null if not found
 */
export const getUserBankDetails = () => {
    try {
        const details = localStorage.getItem(STORAGE_KEYS.BANK_DETAILS);
        return details ? JSON.parse(details) : null;
    } catch (error) {
        console.error('Error retrieving bank details:', error);
        return null;
    }
};

/**
 * Save user's banking details to localStorage
 * @param {Object} details - Banking details object
 * @param {string} details.bankName - Name of the bank
 * @param {string} details.accountHolderName - Account holder's name
 * @param {string} details.accountNumber - Account number
 * @param {string} details.iban - IBAN (optional)
 */
export const saveUserBankDetails = (details) => {
    try {
        localStorage.setItem(STORAGE_KEYS.BANK_DETAILS, JSON.stringify(details));
        return true;
    } catch (error) {
        console.error('Error saving bank details:', error);
        return false;
    }
};

/**
 * Generate a unique transaction ID
 * @returns {string} Transaction ID in format TXN-YYYYMMDD-XXXXXX
 */
export const generateTransactionId = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TXN-${dateStr}-${random}`;
};

/**
 * Get current balance from localStorage
 * @returns {number} Current balance
 */
export const getBalance = () => {
    try {
        const balance = localStorage.getItem(STORAGE_KEYS.BALANCE);
        return balance ? parseFloat(balance) : 50000; // Default starting balance
    } catch (error) {
        console.error('Error retrieving balance:', error);
        return 50000;
    }
};

/**
 * Update balance in localStorage
 * @param {number} newBalance - New balance amount
 */
export const updateBalance = (newBalance) => {
    try {
        localStorage.setItem(STORAGE_KEYS.BALANCE, newBalance.toString());
        return true;
    } catch (error) {
        console.error('Error updating balance:', error);
        return false;
    }
};

/**
 * Save a transaction to localStorage
 * @param {Object} transaction - Transaction object
 * @param {string} transaction.type - 'deposit' or 'withdrawal'
 * @param {number} transaction.amount - Transaction amount
 * @param {string} transaction.status - Transaction status
 * @param {string} transaction.transactionId - Unique transaction ID
 */
export const saveTransaction = (transaction) => {
    try {
        const transactions = getTransactions();
        const newTransaction = {
            ...transaction,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        transactions.unshift(newTransaction); // Add to beginning
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
        return true;
    } catch (error) {
        console.error('Error saving transaction:', error);
        return false;
    }
};

/**
 * Get all transactions from localStorage
 * @returns {Array} Array of transaction objects
 */
export const getTransactions = () => {
    try {
        const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
        return transactions ? JSON.parse(transactions) : [];
    } catch (error) {
        console.error('Error retrieving transactions:', error);
        return [];
    }
};

/**
 * Simulate bank confirmation API call
 * @param {number} amount - Transaction amount
 * @param {string} type - 'deposit' or 'withdrawal'
 * @returns {Promise} Promise that resolves with transaction details
 */
export const simulateBankConfirmation = (amount, type) => {
    return new Promise((resolve, reject) => {
        // Simulate network delay (2-3 seconds)
        const delay = 2000 + Math.random() * 1000;

        setTimeout(() => {
            // 95% success rate for simulation
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
 * @param {number} amount - Amount to deposit
 * @returns {Promise} Promise that resolves with transaction result
 */
export const processDeposit = async (amount) => {
    try {
        // Simulate bank confirmation
        const result = await simulateBankConfirmation(amount, 'deposit');

        // Update balance
        const currentBalance = getBalance();
        const newBalance = currentBalance + amount;
        updateBalance(newBalance);

        // Save transaction
        saveTransaction({
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
 * @param {number} amount - Amount to withdraw
 * @returns {Promise} Promise that resolves with transaction result
 */
export const processWithdrawal = async (amount) => {
    try {
        const currentBalance = getBalance();

        // Check sufficient balance
        if (amount > currentBalance) {
            return {
                success: false,
                message: 'Insufficient funds in your account.'
            };
        }

        // Simulate bank confirmation
        const result = await simulateBankConfirmation(amount, 'withdrawal');

        // Update balance
        const newBalance = currentBalance - amount;
        updateBalance(newBalance);

        // Save transaction
        saveTransaction({
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
