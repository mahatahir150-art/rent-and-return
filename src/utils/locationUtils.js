// Location utility functions using Browser Geolocation API

/**
 * Get user's current location using Browser Geolocation API
 * @returns {Promise<Object>} Location object with latitude, longitude, and accuracy
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({
                error: 'GEOLOCATION_NOT_SUPPORTED',
                message: 'Geolocation is not supported by your browser'
            });
            return;
        }

        const options = {
            enableHighAccuracy: true, // Use GPS if available
            timeout: 10000, // 10 seconds timeout
            maximumAge: 0 // Don't use cached position
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy, // in meters
                    timestamp: position.timestamp
                });
            },
            (error) => {
                let errorMessage = '';
                let errorCode = '';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorCode = 'PERMISSION_DENIED';
                        errorMessage = 'Location access was denied. Please enable location permissions in your browser settings or enter your location manually.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorCode = 'POSITION_UNAVAILABLE';
                        errorMessage = 'Location information is unavailable. Please try again or enter your location manually.';
                        break;
                    case error.TIMEOUT:
                        errorCode = 'TIMEOUT';
                        errorMessage = 'Location request timed out. Please try again or enter your location manually.';
                        break;
                    default:
                        errorCode = 'UNKNOWN_ERROR';
                        errorMessage = 'An unknown error occurred while getting your location.';
                }

                reject({
                    error: errorCode,
                    message: errorMessage,
                    originalError: error
                });
            },
            options
        );
    });
};

/**
 * Convert coordinates to address using reverse geocoding (Nominatim - OpenStreetMap)
 * Free service, no API key required
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Address object
 */
export const reverseGeocode = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'RentAndReturn/1.0' // Required by Nominatim
                }
            }
        );

        if (!response.ok) {
            throw new Error('Reverse geocoding failed');
        }

        const data = await response.json();

        // Extract relevant address components
        const address = data.address || {};

        // Build a readable address
        const city = address.city || address.town || address.village || address.county || '';
        const state = address.state || '';
        const country = address.country || '';
        const suburb = address.suburb || address.neighbourhood || '';
        const road = address.road || '';

        // Create formatted address
        let formattedAddress = '';
        if (road) formattedAddress += road;
        if (suburb) formattedAddress += (formattedAddress ? ', ' : '') + suburb;
        if (city) formattedAddress += (formattedAddress ? ', ' : '') + city;
        if (state && state !== city) formattedAddress += (formattedAddress ? ', ' : '') + state;
        if (country) formattedAddress += (formattedAddress ? ', ' : '') + country;

        return {
            formattedAddress: formattedAddress || data.display_name || 'Unknown location',
            city: city,
            state: state,
            country: country,
            suburb: suburb,
            road: road,
            postalCode: address.postcode || '',
            fullData: data
        };
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        throw {
            error: 'GEOCODING_FAILED',
            message: 'Failed to get address from coordinates. Please enter your location manually.'
        };
    }
};

/**
 * Get user's location with address
 * Combines getCurrentLocation and reverseGeocode
 * @returns {Promise<Object>} Location object with coordinates and address
 */
export const getLocationWithAddress = async () => {
    try {
        // Get coordinates
        const location = await getCurrentLocation();

        // Get address from coordinates
        const address = await reverseGeocode(location.latitude, location.longitude);

        return {
            ...location,
            ...address
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Check if geolocation is supported
 * @returns {boolean}
 */
export const isGeolocationSupported = () => {
    return 'geolocation' in navigator;
};

/**
 * Check current permission status for geolocation
 * @returns {Promise<string>} 'granted', 'denied', or 'prompt'
 */
export const checkLocationPermission = async () => {
    if (!navigator.permissions) {
        return 'prompt'; // Permissions API not supported, will prompt on request
    }

    try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
        console.error('Error checking location permission:', error);
        return 'prompt';
    }
};

/**
 * Format coordinates for display
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {string}
 */
export const formatCoordinates = (latitude, longitude) => {
    const lat = latitude.toFixed(6);
    const lon = longitude.toFixed(6);
    const latDir = latitude >= 0 ? 'N' : 'S';
    const lonDir = longitude >= 0 ? 'E' : 'W';

    return `${Math.abs(lat)}° ${latDir}, ${Math.abs(lon)}° ${lonDir}`;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distanceKm Distance in kilometers
 * @returns {string} Formatted distance
 */
export const formatDistance = (distanceKm) => {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    } else if (distanceKm < 10) {
        return `${distanceKm.toFixed(1)} km`;
    } else {
        return `${Math.round(distanceKm)} km`;
    }
};

/**
 * Save location to localStorage for future use
 * @param {Object} location 
 */
export const saveLastKnownLocation = (location) => {
    try {
        localStorage.setItem('lastKnownLocation', JSON.stringify({
            ...location,
            savedAt: new Date().toISOString()
        }));
    } catch (error) {
        console.error('Error saving location:', error);
    }
};

/**
 * Get last known location from localStorage
 * @returns {Object|null}
 */
export const getLastKnownLocation = () => {
    try {
        const saved = localStorage.getItem('lastKnownLocation');
        if (saved) {
            const location = JSON.parse(saved);
            // Check if location is less than 24 hours old
            const savedAt = new Date(location.savedAt);
            const now = new Date();
            const hoursDiff = (now - savedAt) / (1000 * 60 * 60);

            if (hoursDiff < 24) {
                return location;
            }
        }
        return null;
    } catch (error) {
        console.error('Error getting last known location:', error);
        return null;
    }
};
