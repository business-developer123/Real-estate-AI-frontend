import { FaMapMarkerAlt } from 'react-icons/fa';

const Marker = ({ lat, lng }: { lat: number, lng: number }) => {
    console.log(lat, lng);
    return <div style={{ color: '#d00', fontSize: '1.8rem', transform: 'translate(-50%, -100%)', position: 'absolute', top: lat, left: lng }}>
        <FaMapMarkerAlt />
    </div>;
};

export default Marker;