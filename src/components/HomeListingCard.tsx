import React from 'react';

interface HomeListingCardProps {
    imageUrl?: string;
    address: string;
    beds: number;
    baths: number;
    sqft: number;
    price: number;
    listing: object;
    getReport?: (listing: object) => void;
    onClick?: () => void;
    city?: string;
    state?: string;
    zipcode?: string;
}

const HomeListingCard: React.FC<HomeListingCardProps> = ({
    imageUrl,
    address,
    beds,
    baths,
    sqft,
    price,
    city,
    state,
    zipcode,
    listing,
    onClick,
}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getReport = async (data: any) => {
        const response = await fetch(`${backendUrl}/api/v1/simpai/get-report`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        const reportData = await response.json();
        console.log(reportData);
    }

    return (
        <div className="home-listing-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
            <div className="home-listing-image-wrap">
                <img
                    src={imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={address}
                    className="home-listing-image"
                />
            </div>
            <div className="home-listing-info">
                <div className="home-listing-address">{address}</div>
                <div className="home-listing-city">{`${city ?? ''}, ${state ?? ''} ${zipcode ?? ''}`}</div>
                <div className="home-listing-details">
                    <span>{beds} Bed</span> / <span>{baths} Bath</span> / <span>{sqft.toLocaleString()} ft²</span>
                </div>
                <div className="home-listing-price">${price.toLocaleString()}</div>
                <button
                    className="home-listing-report-btn"
                    onClick={e => {
                        e.stopPropagation();
                        getReport(listing);
                    }}
                >
                    Get Property Report
                </button>
            </div>
        </div>
    );
};

export default HomeListingCard; 