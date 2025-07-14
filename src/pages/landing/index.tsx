import React, { useEffect, useState } from 'react';
import './index.css';
import { FaBell, FaCalculator, FaMapMarkedAlt, FaHome, FaBuilding, FaRobot, FaHistory, FaRegEdit, FaTimes, FaThLarge, FaMap, FaDownload, FaRegClock, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import HomeListingCard from '../../components/HomeListingCard';
import GoogleMapReact from 'google-map-react';
import Marker from '../../components/Marker';

const suggestions = [
    "Find me all single family homes for sale with a pool in 92037",
    "What is the estimated value of 7209 48th Street Ct NW, Gig Harbor, WA 98335?",
    "Show me all single family homes for sale in Phoenix, AZ under $400K",
    "What's the average list price of for-sale 2 bed, 2 bath homes in Phoenix, AZ?",
];

const Landing: React.FC = () => {
    const [search, setSearch] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchMessage, setSearchMessage] = useState('');
    const [listings, setListings] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState('card');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isHomeDisplayed, setIsHomeDisplayed] = useState(true);
    const [selectedHome, setSelectedHome] = useState<any | null>(null);
    const [detailTab, setDetailTab] = useState<'images' | 'street'>('images');
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);
    const [latitude, setLatitude] = useState(33.0974329);
    const [longitude, setLongitude] = useState(-111.4632532);
    const [homeDetail, setHomeDetail] = useState<any[]>([]);
    const [streetViewUrl, setStreetViewUrl] = useState('');
    const [streetImage, setStreetImage] = useState('');

    useEffect(() => {
        if (listings.length > 0) {
            const firstListing = listings[0] as any;
            setLatitude(firstListing.latitude || latitude);
            setLongitude(firstListing.longitude || longitude);
        }
    }, [listings]);

    const fetchSearch = async (message: string) => {
        setIsLoading(true);
        const response = await fetch(`https://real-estate-ai-backend-9o37.onrender.com/api/v1/simpai/analyze-property`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput: message }),
        });
        if (response.status !== 200) {
            alert('You sent too many requests. Please try again later.');
            setIsLoading(false);
            return;
        }
        const data = await response.json();
        setListings(data.listings);
        setDescription(data.description);
        setIsLoading(false);
        return data;
    }

    const handleSearch = () => {
        if (!search) {
            setIsSearchOpen(false);
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

    const getHomeDetail = async (address: string) => {
        console.log(address);
        const response = await fetch(`https://zillow56.p.rapidapi.com/search_address?address=${address}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': "2e5dd68fe7mshd661c7de69087c4p153130jsn820b372673ae",
                'x-rapidapi-host': 'zillow56.p.rapidapi.com'
            }
        });
        const data = await response.json();
        setStreetViewUrl(data.streetViewMetadataUrlMapLightboxAddress);
        setHomeDetail(data.originalPhotos);
    }

    const downloadCSV = () => {
        if (!listings || listings.length === 0) return;
        const replacer = (_: any, value: any) => value === null ? '' : value;
        const header = Object.keys(listings[0]);
        const csv = [
            header.join(','),
            ...listings.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'listings.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getStreetViewUrl = async (url: string) => {
        const response = await fetch("https://real-estate-ai-backend-9o37.onrender.com/api/v1/simpai/streetview", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: url }),
        });
        const data = await response.json();

        const imageUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${data.location.lat},${data.location.lng}&heading=90&pitch=0&key=AIzaSyBV4lXhV-qzQOegyA3m0_AvGy9F21HIyOQ`;
        const image = await fetch(imageUrl);
        const imageBlob = await image.blob();
        const streetImageUrl = URL.createObjectURL(imageBlob);
        setStreetImage(streetImageUrl);
    }

    useEffect(() => {
        if (detailTab === 'street' && streetViewUrl) {
            getStreetViewUrl(streetViewUrl);
        }
    }, [detailTab, streetViewUrl])

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
                                    <span style={{ marginTop: 18 }} className="icon" role="img" aria-label="ai">🤖</span>
                                    {isLoading ? (
                                        <span style={{ marginTop: 18 }}>Loading...</span>
                                    ) : (
                                        <div style={{ width: '100%' }}>
                                            <p dangerouslySetInnerHTML={{ __html: description }} />
                                            <div className="download-row">
                                                <span className="download-csv-btn" onClick={downloadCSV}>
                                                    <FaDownload style={{ marginRight: 8 }} /> Download as CSV
                                                </span>
                                                <span className="download-status" onClick={() => setIsHomeDisplayed(true)}><FaRegClock style={{ marginRight: 6 }} />Viewing now</span>
                                            </div>
                                        </div>
                                    )}
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
                        {selectedHome ? (
                            <div className="home-detail-section">
                                <div className="home-detail-header">
                                    <button className="home-detail-back" onClick={() => setSelectedHome(null)}>&lt; Back to preview</button>
                                    <div className="home-detail-title">{selectedHome.streetAddress}</div>
                                    <div className="home-detail-location">{selectedHome.city}, {selectedHome.state} {selectedHome.zipcode}</div>
                                    <div className="home-detail-info-row">
                                        <span className="home-detail-info"><FaBed /> {selectedHome.bedrooms} BR</span>
                                        <span className="home-detail-info"><FaBath /> {selectedHome.bathrooms} BA</span>
                                        <span className="home-detail-info"><FaRulerCombined /> {selectedHome.livingArea} Sq.ft</span>
                                        <span className="home-detail-info home-detail-price">List price <b>${selectedHome.price?.toLocaleString()}</b></span>
                                    </div>
                                </div>
                                <div className="home-detail-tabs">
                                    <button className={`home-detail-tab${detailTab === 'images' ? ' active' : ''}`} onClick={() => setDetailTab('images')}>Images</button>
                                    <button className={`home-detail-tab${detailTab === 'street' ? ' active' : ''}`} onClick={() => setDetailTab('street')}>Street view</button>
                                </div>
                                {detailTab === 'images' && (
                                    <div className="home-detail-images-section">
                                        <div className="home-detail-main-image-wrap">
                                            <img className="home-detail-main-image" src={homeDetail.length > 0 ? homeDetail[selectedImageIdx].mixedSources.jpeg[0].url : selectedHome.imgSrcArray?.[selectedImageIdx] || selectedHome.imgSrc} alt="Home" />
                                        </div>
                                        <div className="home-detail-thumbnails">
                                            {(homeDetail.length > 0 ? homeDetail : []).map((img: any, idx: number) => (
                                                <img
                                                    key={idx}
                                                    src={img.mixedSources.jpeg[0].url}
                                                    alt="thumb"
                                                    className={`home-detail-thumb${selectedImageIdx === idx ? ' selected' : ''}`}
                                                    onClick={() => setSelectedImageIdx(idx)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {detailTab === 'street' && (
                                    <div className="home-detail-streetview">
                                        {
                                            streetImage && (
                                                <img src={streetImage} className="home-detail-streetview-image" alt="Street view" />
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                {Array.isArray(listings) && listings.length > 0 && (
                                    <div className={`landing-listings-panel ${!isHomeDisplayed ? 'landing-listings-panel-home-displayed' : ''}`}>
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
                                            <button className="listings-panel-close-btn" onClick={() => setIsHomeDisplayed(false)} title="Close">
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
                                                        onClick={() => {
                                                            getHomeDetail(listing.streetAddress + ' ' + listing.city + ' ' + listing.state + ' ' + listing.zipcode);
                                                            setSelectedHome(listing);
                                                            setDetailTab('images');
                                                            setSelectedImageIdx(0);
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {viewMode === 'map' && (
                                            <div className="home-listings-map-placeholder">
                                                <GoogleMapReact
                                                    bootstrapURLKeys={{ key: "AIzaSyB6IcDkdLFimq6E5YVNyuslp3Z2O2IpZU0" }}
                                                    // AIzaSyB32OTfrZzx4ypSxpQdQHXUeaMwL--nfVw
                                                    // AIzaSyB6IcDkdLFimq6E5YVNyuslp3Z2O2IpZU0
                                                    defaultCenter={{ lat: latitude, lng: longitude }}
                                                    defaultZoom={12}
                                                >
                                                    {listings.map((listing: any, idx: number) => (
                                                        <Marker key={idx} lat={listing.latitude} lng={listing.longitude} listing={listing} />
                                                    ))}
                                                </GoogleMapReact>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
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