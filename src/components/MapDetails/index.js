// MapDrawComponent.jsx
import React, { useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const MapDetails = () => {
    const featureGroupRef = useRef(null);

    const handleCreated = (e) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const coords = layer.getLatLngs();
            console.log('Polygon Coordinates:', coords);
        }
    };

    return (
        <MapContainer center={[12.2958, 76.6394]} zoom={12} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; OpenStreetMap contributors'
            />

            <FeatureGroup ref={featureGroupRef}>
                <EditControl
                    position='topright'
                    onCreated={handleCreated}
                    draw={{
                        rectangle: false,
                        circle: false,
                        circlemarker: false,
                        marker: false,
                        polyline: false,
                        polygon: true,
                    }}
                />
            </FeatureGroup>
        </MapContainer>
    );
};

export default MapDetails;
