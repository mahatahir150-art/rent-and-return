import { useState } from 'react';
import { Search, Filter, MapPin, Loader } from 'lucide-react';
import Button from './Button';
import { getLocationWithAddress } from '../utils/locationUtils';
import toast from 'react-hot-toast';

const SearchBar = ({ onSearch }) => {
    const [localQuery, setLocalQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const handleSearch = () => {
        onSearch(localQuery);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleNearMe = async () => {
        setLoadingLocation(true);
        try {
            const locationData = await getLocationWithAddress();
            console.log("Location found:", locationData);

            // Prioritize Suburb/Neighborhood for better local relevance, fallback to City
            const specificLocation = locationData.suburb || locationData.city || locationData.town || '';
            const broaderLocation = locationData.city || locationData.state || '';

            // Construct search query
            const locationString = specificLocation ? `${specificLocation}, ${broaderLocation}` : broaderLocation;

            if (locationString) {
                setLocalQuery(locationString);
                onSearch(locationString); // Filter by this location string
                toast.success(`Location set to: ${locationString}`);
            } else {
                toast.error("Could not determine a specific city or area from your location.");
            }

        } catch (error) {
            console.error("Error getting location:", error);
            toast.error(error.message || "Failed to get location. Please ensure location services are enabled.");
        } finally {
            setLoadingLocation(false);
        }
    };

    return (
        <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Filter Button (Left - Small) */}
                <Button
                    variant="primary"
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        width: '48px',
                        padding: '0',
                        flexShrink: 0,
                        height: '42px', // Match other inputs
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: showFilters ? 'var(--primary-hover)' : 'var(--primary)', // Solid maroon always, darker when active
                    }}
                    title="Filters"
                >
                    <Filter size={20} />
                </Button>

                {/* Search Input (Rest of Width) */}
                <input
                    type="text"
                    placeholder="Search query or 'Location'"
                    value={localQuery}
                    onChange={(e) => {
                        setLocalQuery(e.target.value);
                        onSearch(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: 1,
                        padding: '0 1rem',
                        height: '48px',
                        border: '2px solid #e2e8f0',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        backgroundColor: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
            </div>

            {showFilters && (
                <div className="animate-fade-in" style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '1rem',
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    paddingBottom: '0.5rem' // Scroll space
                }}>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label className="label">Category</label>
                        <select className="input-field" style={{ padding: '0.5rem', width: '100%', height: '42px' }}>
                            <option>All</option>
                            <option>Electronics</option>
                            <option>Furniture</option>
                            <option>Tools</option>
                            <option>Vehicles</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label className="label">Price Range</label>
                        <select className="input-field" style={{ padding: '0.5rem', width: '100%', height: '42px' }}>
                            <option>Any</option>
                            <option>PKR 0 - PKR 5000</option>
                            <option>PKR 5000 - PKR 10000</option>
                            <option>PKR 10000+</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label className="label">Availability</label>
                        <select className="input-field" style={{ padding: '0.5rem', width: '100%', height: '42px' }}>
                            <option>Any</option>
                            <option>Available Now</option>
                            <option>This Weekend</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <label className="label">Rating</label>
                        <select className="input-field" style={{ padding: '0.5rem', width: '100%', height: '42px' }}>
                            <option>Any</option>
                            <option>4+ Stars</option>
                            <option>3+ Stars</option>
                        </select>
                    </div>
                    <div style={{ flex: 1, minWidth: '150px' }}>
                        <Button
                            variant="outline"
                            icon={loadingLocation ? Loader : MapPin}
                            onClick={handleNearMe}
                            style={{ width: '100%', height: '42px', padding: '0.625rem' }}
                            disabled={loadingLocation}
                        >
                            {loadingLocation ? "Locating..." : "Near Me"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
