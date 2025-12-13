import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const [currency, setCurrency] = useState('PKR');
    const [country, setCountry] = useState('PK');
    const [exchangeRates, setExchangeRates] = useState({ USD: 1, PKR: 278, EUR: 0.92, GBP: 0.79 }); // Fallback rates
    const [loading, setLoading] = useState(false); // Default false to allow immediate render

    // Auto-detect country and set currency/language
    // Auto-detect country and set currency/language
    useEffect(() => {
        const detectLocation = async () => {
            try {
                // Background fetch, do not block UI with set loading true
                // Using ipapi.co for free IP location
                const response = await axios.get('https://ipapi.co/json/');
                const data = response.data;
                const userCountry = data.country_code; // e.g., 'PK', 'US'

                setCountry(userCountry);

                if (userCountry === 'PK') {
                    setCurrency('PKR');
                    // i18n.changeLanguage('ur'); // Optional: Keep English default for consistency
                } else if (['ES', 'MX', 'AR'].includes(userCountry)) {
                    i18n.changeLanguage('es');
                    setCurrency(data.currency || 'USD');
                } else {
                    // For MVP, prefer PKR if uncertain, or stick to detected currency
                    // But to fix user issue, we prioritize PKR if they are in PK or if standard
                    setCurrency(data.currency || 'USD');
                }

            } catch (error) {
                console.error("Error detecting location:", error);
                // Fallback already set (PKR)
            } finally {
                // setLoading(false); // No longer needed as we don't start with loading=true
            }
        };
        // Small delay to prioritize main thread for rendering
        const timer = setTimeout(() => {
            detectLocation();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Format price helper
    const formatPrice = (price) => {
        // MVP: Assume input price is already in the target currency (PKR)
        // Do NOT convert unless we are strictly multi-currency with USD base.
        // User inputs 5000 PKR -> we show 5000 PKR.

        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: currency || 'PKR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const value = {
        currency,
        setCurrency,
        country,
        formatPrice,
        changeLanguage: (lang) => i18n.changeLanguage(lang),
        currentLanguage: i18n.language
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};
