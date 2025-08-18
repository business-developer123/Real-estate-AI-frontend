import React, { useState } from 'react';
import toast from 'react-hot-toast';

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
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    const getReport = async (data: any) => {
        if (isGeneratingReport) return;

        setIsGeneratingReport(true);
        const toastId = toast.loading('Generating property report...');

        try {
            const response = await fetch(`${backendUrl}/api/v1/simpai/get-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listing: data })
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            // Get the response with download URL
            const result = await response.json();

            if (!result.success || !result.downloadUrl) {
                throw new Error('Failed to get download URL');
            }

            // Create download link using the server file URL
            const a = document.createElement('a');
            a.href = result.downloadUrl;
            a.download = result.fileName;
            a.target = '_blank'; // Open in new tab as fallback
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            toast.success('Property report downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate property report. Please try again.', { id: toastId });
        } finally {
            setIsGeneratingReport(false);
        }
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
                    className={`home-listing-report-btn ${isGeneratingReport ? 'loading' : ''}`}
                    onClick={e => {
                        e.stopPropagation();
                        getReport(listing);
                    }}
                    disabled={isGeneratingReport}
                >
                    {isGeneratingReport ? 'Generating...' : 'Get Property Report'}
                </button>
            </div>
        </div>
    );
};

export default HomeListingCard; 