// Validation utility functions for banking and product data

/**
 * Validate IBAN (International Bank Account Number)
 * Supports international IBAN format
 */
export const validateIBAN = (iban) => {
    if (!iban) {
        return { isValid: true, message: 'IBAN is optional' }; // IBAN is optional
    }

    // Remove spaces and convert to uppercase
    const cleaned = iban.replace(/\s/g, '').toUpperCase();

    // IBAN should be 15-34 characters
    if (cleaned.length < 15 || cleaned.length > 34) {
        return {
            isValid: false,
            message: 'IBAN must be between 15 and 34 characters'
        };
    }

    // Check if it starts with 2 letters (country code) followed by 2 digits (check digits)
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
    if (!ibanRegex.test(cleaned)) {
        return {
            isValid: false,
            message: 'IBAN format is invalid. Should start with country code (e.g., PK)'
        };
    }

    // Pakistan IBAN should be 24 characters
    if (cleaned.startsWith('PK') && cleaned.length !== 24) {
        return {
            isValid: false,
            message: 'Pakistan IBAN must be exactly 24 characters'
        };
    }

    return {
        isValid: true,
        formatted: cleaned
    };
};

/**
 * Validate bank account number for Pakistani banks
 */
export const validateAccountNumber = (accountNumber, bankName = '') => {
    if (!accountNumber || accountNumber.trim().length === 0) {
        return {
            isValid: false,
            message: 'Account number is required'
        };
    }

    // Remove spaces and hyphens
    const cleaned = accountNumber.replace(/[\s-]/g, '');

    // Check if it contains only digits
    if (!/^\d+$/.test(cleaned)) {
        return {
            isValid: false,
            message: 'Account number must contain only digits'
        };
    }

    // Most Pakistani banks use 10-16 digit account numbers
    if (cleaned.length < 10 || cleaned.length > 16) {
        return {
            isValid: false,
            message: 'Account number must be between 10 and 16 digits'
        };
    }

    // Specific bank validations
    if (bankName.includes('HBL') && cleaned.length !== 14) {
        return {
            isValid: false,
            message: 'HBL account numbers are typically 14 digits'
        };
    }

    return {
        isValid: true,
        formatted: cleaned
    };
};

/**
 * Validate account holder name
 */
export const validateAccountHolderName = (name, userFullName = '') => {
    if (!name || name.trim().length === 0) {
        return {
            isValid: false,
            message: 'Account holder name is required'
        };
    }

    // Should contain only letters, spaces, and common punctuation
    const nameRegex = /^[a-zA-Z\s.'-]{2,100}$/;
    if (!nameRegex.test(name.trim())) {
        return {
            isValid: false,
            message: 'Account holder name contains invalid characters'
        };
    }

    // Optional: Check if account holder name matches user's name (fuzzy match)
    if (userFullName) {
        const nameLower = name.toLowerCase().replace(/[.\s'-]/g, '');
        const userNameLower = userFullName.toLowerCase().replace(/[.\s'-]/g, '');

        // Check if names are similar (at least 70% match)
        const similarity = calculateStringSimilarity(nameLower, userNameLower);
        if (similarity < 0.5) {
            return {
                isValid: true, // Still valid, but show warning
                warning: 'Account holder name does not match your profile name',
                formatted: name.trim()
            };
        }
    }

    return {
        isValid: true,
        formatted: name.trim()
    };
};

/**
 * Calculate string similarity (Levenshtein distance based)
 */
function calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

/**
 * Validate product price
 */
export const validatePrice = (price) => {
    const numPrice = parseFloat(price);

    if (isNaN(numPrice)) {
        return {
            isValid: false,
            message: 'Price must be a valid number'
        };
    }

    if (numPrice <= 0) {
        return {
            isValid: false,
            message: 'Price must be greater than 0'
        };
    }

    if (numPrice > 10000000) {
        return {
            isValid: false,
            message: 'Price seems unreasonably high. Please verify.'
        };
    }

    return {
        isValid: true,
        value: numPrice
    };
};

/**
 * Validate product title
 */
export const validateProductTitle = (title) => {
    if (!title || title.trim().length === 0) {
        return {
            isValid: false,
            message: 'Product title is required'
        };
    }

    if (title.trim().length < 3) {
        return {
            isValid: false,
            message: 'Product title must be at least 3 characters'
        };
    }

    if (title.trim().length > 100) {
        return {
            isValid: false,
            message: 'Product title must not exceed 100 characters'
        };
    }

    return {
        isValid: true,
        formatted: title.trim()
    };
};

/**
 * Validate product description
 */
export const validateProductDescription = (description) => {
    if (!description || description.trim().length === 0) {
        return {
            isValid: false,
            message: 'Product description is required'
        };
    }

    if (description.trim().length < 10) {
        return {
            isValid: false,
            message: 'Product description must be at least 10 characters'
        };
    }

    if (description.trim().length > 1000) {
        return {
            isValid: false,
            message: 'Product description must not exceed 1000 characters'
        };
    }

    return {
        isValid: true,
        formatted: description.trim()
    };
};

/**
 * Format currency for display (Pakistani Rupees)
 */
export const formatCurrency = (amount) => {
    return `Rs. ${parseFloat(amount).toLocaleString('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
};

/**
 * Format account number for display (mask middle digits)
 */
export const formatAccountNumberForDisplay = (accountNumber) => {
    if (!accountNumber) return '';

    const cleaned = accountNumber.replace(/[\s-]/g, '');

    if (cleaned.length <= 4) return cleaned;

    // Show first 2 and last 4 digits, mask the rest
    const firstTwo = cleaned.slice(0, 2);
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 6);

    return `${firstTwo}${masked}${lastFour}`;
};
