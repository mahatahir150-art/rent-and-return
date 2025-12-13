// Authentication utility functions for validation and verification

/**
 * Validate phone number format (international format)
 * Supports formats like: +923001234567, +1234567890, etc.
 */
export const validatePhoneNumber = (phone) => {
    // Remove all spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Check if it starts with + and has 10-15 digits
    const phoneRegex = /^\+[1-9]\d{9,14}$/;

    if (!phoneRegex.test(cleaned)) {
        return {
            isValid: false,
            message: 'Phone number must be in international format (e.g., +923001234567)'
        };
    }

    return {
        isValid: true,
        formatted: cleaned
    };
};

/**
 * Validate email address with comprehensive regex
 */
export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: 'Please enter a valid email address'
        };
    }

    return {
        isValid: true,
        email: email.toLowerCase()
    };
};

/**
 * Check password strength and return requirements
 */
export const validatePassword = (password) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const allMet = Object.values(requirements).every(req => req);

    let message = '';
    if (!requirements.minLength) message = 'Password must be at least 8 characters long';
    else if (!requirements.hasUppercase) message = 'Password must contain at least one uppercase letter';
    else if (!requirements.hasLowercase) message = 'Password must contain at least one lowercase letter';
    else if (!requirements.hasNumber) message = 'Password must contain at least one number';
    else if (!requirements.hasSpecial) message = 'Password must contain at least one special character';

    return {
        isValid: allMet,
        requirements,
        message,
        strength: allMet ? 'strong' : (requirements.minLength && requirements.hasUppercase) ? 'medium' : 'weak'
    };
};

/**
 * Validate full name (no numbers or special characters except spaces, hyphens, apostrophes)
 */
export const validateFullName = (name) => {
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;

    if (!nameRegex.test(name.trim())) {
        return {
            isValid: false,
            message: 'Name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)'
        };
    }

    return {
        isValid: true,
        formatted: name.trim()
    };
};

/**
 * Format phone number for display
 * Example: +923001234567 -> +92 300 1234567
 */
export const formatPhoneForDisplay = (phone) => {
    if (!phone) return '';

    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Format based on length
    if (cleaned.startsWith('+92')) {
        // Pakistan format: +92 300 1234567
        return cleaned.replace(/(\+92)(\d{3})(\d+)/, '$1 $2 $3');
    } else if (cleaned.startsWith('+1')) {
        // US format: +1 (234) 567-8900
        return cleaned.replace(/(\+1)(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4');
    }

    // Default format: +XX XXX XXXXXXX
    return cleaned.replace(/(\+\d{1,3})(\d{3})(\d+)/, '$1 $2 $3');
};

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
};

/**
 * Check if user is rate limited (simple client-side check)
 * For production, implement server-side rate limiting
 */
export const checkRateLimit = (key, maxAttempts = 20, windowMs = 15 * 60 * 1000) => {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');

    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

    if (recentAttempts.length >= maxAttempts) {
        const oldestAttempt = Math.min(...recentAttempts);
        const timeUntilReset = Math.ceil((windowMs - (now - oldestAttempt)) / 1000 / 60);

        return {
            allowed: false,
            message: `Too many attempts. Please try again in ${timeUntilReset} minute(s).`,
            resetIn: timeUntilReset
        };
    }

    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(`rateLimit_${key}`, JSON.stringify(recentAttempts));

    return {
        allowed: true,
        remainingAttempts: maxAttempts - recentAttempts.length
    };
};

/**
 * Clear rate limit for a specific key
 */
export const clearRateLimit = (key) => {
    localStorage.removeItem(`rateLimit_${key}`);
};
