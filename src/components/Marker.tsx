import { useState } from 'react';

const Marker = ({ lat, lng, listing }: { lat: number; lng: number; listing: any }) => {
    console.log(lat, lng);
    const [isHovered, setIsHovered] = useState(false);
    return <>
        <div className="marker-container" onClick={() => setIsHovered(prev => !prev)}>
            <div className="marker-tooltip">{`$${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</div>
        </div>;
        {isHovered && (
            <>
                <div className="marker-data-tooltip">
                    <div className="marker-data-tooltip-item">
                        <span className="marker-data-tooltip-item-label">Address</span>
                        <span className="marker-data-tooltip-item-value">{listing.streetAddress}</span>
                    </div>
                    <div className='marker-city-state-zipcode'>
                        <div className="marker-data-tooltip-item">
                            <span className="marker-data-tooltip-item-value">{listing.city}</span>
                        </div>
                        <div className="marker-data-tooltip-item">
                            <span className="marker-data-tooltip-item-value">{listing.state}</span>
                        </div>
                        <div className="marker-data-tooltip-item">
                            <span className="marker-data-tooltip-item-value">{listing.zipcode}</span>
                        </div>
                    </div>
                    <div className='marker-bedrooms-bathrooms-square-feet'>
                        <span>{listing.bedrooms + " BR"}</span>
                        <span>{listing.bathrooms + " BA"}</span>
                        <span>{listing.livingArea + " SQFT"}</span>
                    </div>
                    <div className="marker-data-tooltip-item">
                        <span className="marker-data-tooltip-item-label">Price</span>
                        <span className="marker-data-tooltip-item-value">{`$${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}</span>
                    </div>
                </div>
            </>
        )}
    </>
};

export default Marker;