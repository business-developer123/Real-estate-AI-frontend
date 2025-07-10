import React, { useEffect, useState } from 'react';
import './index.css';
import { FaBell, FaCalculator, FaMapMarkedAlt, FaHome, FaBuilding, FaRobot, FaHistory, FaRegEdit, FaTimes, FaThLarge, FaMap } from 'react-icons/fa';
import HomeListingCard from '../../components/HomeListingCard';

const suggestions = [
    'Show me 3 bed, 2 bath single-family homes in Austin, TX under $350K',
    'What’s the estimated ARV for 456 Elm St, Dallas, TX 75201?',
    'Calculate the cap rate for a rental at 789 Pine Ave, Seattle, WA',
    'Find all properties for sale in San Antonio, TX with at least 5 % rental yield',
];

const GOOGLE_MAPS_API_KEY = "AIzaSyC1faHDtgBc8q9Lymkr32G6QUiNZYL5AuE";
;

const Landing: React.FC = () => {
    const [search, setSearch] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchMessage, setSearchMessage] = useState('');
    const [listings, setListings] = useState([]);
    const [showListingsPanel, setShowListingsPanel] = useState(false);
    const [viewMode, setViewMode] = useState('card');
    const [description, setDescription] = useState('');

    const fetchSearch = async (message: string) => {
        const response = await fetch(`http://localhost:1001/api/v1/simpai/analyze-property`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput: message }),
        });
        const data = await response.json();
        setListings(data.listings);
        setDescription(data.description);
        return data;
    }

    const handleSearch = () => {
        if (!search) {
            setIsSearchOpen(false);
            alert('Please enter a search term');
            return;
        }
        setIsSearchOpen(true);
        setSearchMessage(search);
        setSearch('');
        fetchSearch(search);
    }

    const keySearch = (s: string) => {
        setIsSearchOpen(true);
        setSearchMessage(s);
        setSearch('');
        fetchSearch(s);
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
        return () => {
            document.removeEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }
    }, [search])

    return (
        <div className="landing-root landing-flex">
            {/* Header */}
            <header className="landing-header-bar">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-icon"><span role="img" aria-label="logo">💡</span></span>
                    <span className="sidebar-logo-text">Simple Deals</span>
                </div>
                <div className="header-actions">
                    <div className="header-bell-wrap">
                        <FaBell className="header-bell" />
                        <span className="header-bell-dot">1</span>
                    </div>
                    <div className="header-avatar">B</div>
                </div>
            </header>
            {/* Main Content */}
            <div className="landing-main landing-main-centered">
                {/* Sidebar */}
                <aside className="landing-sidebar">

                    <nav className="sidebar-nav">
                        <a className="sidebar-nav-link" href="#"><FaHome /> Home</a>
                        <a className="sidebar-nav-link" href="#"><FaCalculator /> Calculator</a>
                        <a className="sidebar-nav-link" href="#"><FaMapMarkedAlt /> Section map</a>
                        <a className="sidebar-nav-link" href="#"><FaBuilding /> Properties</a>
                        <a className="sidebar-nav-link active" href="#"><FaRobot /> Simp AI</a>
                    </nav>
                </aside>
                {/* Main Content and Listings Side-by-Side */}
                {isSearchOpen ? (
                    <div className="landing-content-row">
                        <div className="landing-card landing-chat-col landing-card-search-open">
                            <div className="landing-card-topbar">
                                <button className="landing-card-icon-btn" title="History"><FaHistory /></button>
                                <button className="landing-card-icon-btn" title="Edit"><FaRegEdit /></button>
                            </div>
                            <div className="landing-chat-area">
                                <div className="user-message">
                                    {searchMessage}
                                </div>
                                <div className="assistant-message">
                                    <span className="icon" role="img" aria-label="ai">🤖</span>
                                    <p dangerouslySetInnerHTML={{ __html: description }} />
                                </div>
                            </div>
                            <div className="landing-card-bottom">
                                <div className="landing-search-bar">
                                    <input
                                        className="landing-search-input"
                                        placeholder="123 , city , State"
                                        autoComplete="off"
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                    <button className="landing-search-btn" onClick={handleSearch}>
                                        <span className="landing-search-arrow">→</span>
                                    </button>
                                </div>
                                <div className="landing-search-hint">
                                    Ask about properties, market trends, or investment opportunities
                                </div>
                            </div>
                        </div>
                        {Array.isArray(listings) && listings.length > 0 && (
                            <div className="landing-listings-panel">
                                <div className="listings-panel-header-bar">
                                    <div className="listings-panel-header-bar">
                                        <div className="listings-toggle-group">
                                            <button
                                                className={`listings-toggle-btn${viewMode === 'card' ? ' active' : ''}`}
                                                onClick={() => setViewMode('card')}
                                            >
                                                <FaThLarge style={{ marginRight: 6 }} />
                                                Card view
                                            </button>
                                            <button
                                                className={`listings-toggle-btn${viewMode === 'map' ? ' active' : ''}`}
                                                onClick={() => setViewMode('map')}
                                            >
                                                <FaMap style={{ marginRight: 6 }} />
                                                Map
                                            </button>
                                        </div>
                                    </div>
                                    <button className="listings-panel-close-btn" onClick={() => setShowListingsPanel(false)} title="Close">
                                        <FaTimes />
                                    </button>
                                </div>
                                {viewMode === 'card' && (
                                    <div className="home-listings-grid">
                                        {listings.map((listing: any, idx: number) => (
                                            <HomeListingCard
                                                key={idx}
                                                imageUrl={listing.imgSrc}
                                                address={listing.streetAddress}
                                                beds={listing.bedrooms || 0}
                                                baths={listing.bathrooms || 0}
                                                sqft={listing.livingArea || 0}
                                                price={listing.price || 0}
                                                city={listing.city}
                                                state={listing.state}
                                                zipcode={listing.zipcode}
                                                onReportClick={() => window.open(listing.property_url, '_blank')}
                                            />
                                        ))}
                                    </div>
                                )}
                                {viewMode === 'map' && (
                                    <div className="home-listings-map-placeholder">
                                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3342.4430975540613!2d-111.46325329999999!3d33.097432999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872a386fdf0e866d%3A0x70ef52310c8ebead!2s9564%20Cotton%20Rd%2C%20Florence%2C%20AZ%2085132%2C%20USA!5e0!3m2!1sen!2sfr!4v1752180489674!5m2!1sen!2sfr" style={{ width: '100%', height: '100%', border: 0, borderRadius: 10 }} ></iframe>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`landing-card`}>
                        <div className="landing-card-topbar">
                            <button className="landing-card-icon-btn" title="History"><FaHistory /></button>
                            <button className="landing-card-icon-btn" title="Edit"><FaRegEdit /></button>
                        </div>
                        <div className="landing-card-content">
                            <h1 className="landing-title">Instant Real Estate Insights</h1>
                            <div className="landing-suggestions-grid">
                                {suggestions.map((s, i) => (
                                    <div className="landing-suggestion-card" key={i} onClick={() => keySearch(s)}>{s}</div>
                                ))}
                            </div>
                        </div>
                        <div className="landing-card-bottom">
                            <div className="landing-search-bar">
                                <input
                                    className="landing-search-input"
                                    placeholder="123 , city , State"
                                    autoComplete="off"
                                    value={search}
                                    onChange={handleSearchChange}
                                />
                                <button className="landing-search-btn" onClick={handleSearch}>
                                    <span className="landing-search-arrow">→</span>
                                </button>
                            </div>
                            <div className="landing-search-hint">
                                Ask about properties, market trends, or investment opportunities
                            </div>
                        </div>
                    </div>
                )}
                <div className="landing-cityscape-bg"></div>
            </div>
        </div>
    );
};

export default Landing;