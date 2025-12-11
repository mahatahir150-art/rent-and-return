import { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import Button from './Button';

const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem'
        }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} size={20} />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.875rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                </div>
                <Button
                    variant={showFilters ? 'primary' : 'outline'}
                    onClick={() => setShowFilters(!showFilters)}
                    style={{ width: 'auto' }}
                    icon={Filter}
                >
                    Filters
                </Button>
            </div>

            {showFilters && (
                <div className="animate-fade-in" style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem'
                }}>
                    <div>
                        <label className="label">Category</label>
                        <select className="input-field" style={{ padding: '0.5rem' }}>
                            <option>All</option>
                            <option>Electronics</option>
                            <option>Furniture</option>
                            <option>Tools</option>
                            <option>Vehicles</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Price Range</label>
                        <select className="input-field" style={{ padding: '0.5rem' }}>
                            <option>Any</option>
                            <option>$0 - $50</option>
                            <option>$50 - $200</option>
                            <option>$200+</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Availability</label>
                        <select className="input-field" style={{ padding: '0.5rem' }}>
                            <option>Any</option>
                            <option>Available Now</option>
                            <option>This Weekend</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Rating</label>
                        <select className="input-field" style={{ padding: '0.5rem' }}>
                            <option>Any</option>
                            <option>4+ Stars</option>
                            <option>3+ Stars</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button variant="outline" icon={MapPin} style={{ width: '100%', padding: '0.625rem' }}>
                            Near Me
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
