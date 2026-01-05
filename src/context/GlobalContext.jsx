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
                // 1. IP-based detection for Currency/Country (Metadata)
                const response = await axios.get('https://ipapi.co/json/');
                const data = response.data;
                const userCountry = data.country_code;

                setCountry(userCountry);

                if (userCountry === 'PK') {
                    setCurrency('PKR');
                } else if (['ES', 'MX', 'AR'].includes(userCountry)) {
                    i18n.changeLanguage('es');
                    setCurrency(data.currency || 'USD');
                } else {
                    setCurrency(data.currency || 'USD');
                }

                // 2. Precise Geolocation for "Item Request" Radius feature
                // We need to save this to Firebase if the user is logged in
                const { auth } = await import('../config/firebase');
                const user = auth.currentUser;

                if (user) {
                    try {
                        const { getLocationWithAddress } = await import('../utils/locationUtils');
                        const locationData = await getLocationWithAddress();

                        if (locationData && locationData.latitude && locationData.longitude) {
                            const { realtimeDb: db } = await import('../config/firebase');
                            const { ref, update } = await import('firebase/database');

                            // Update user location in DB
                            await update(ref(db, `users/${user.uid}`), {
                                location: {
                                    lat: locationData.latitude,
                                    lng: locationData.longitude,
                                    address: locationData.formattedAddress,
                                    updatedAt: new Date().toISOString()
                                }
                            });
                            console.log("User location updated in Firebase");
                        }
                    } catch (geoError) {
                        console.log("Geolocation permission denied or ignored:", geoError);
                        // Non-blocking, user might have denied permission
                    }
                }

            } catch (error) {
                console.error("Error detecting location:", error);
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
