// MapDrawComponent.jsx
import React, { useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, LayersControl, LayerGroup } from 'react-leaflet';

import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Cookies from 'js-cookie';

const MapDetails = () => {
    const featureGroupRef = useRef(null);
    const { BaseLayer } = LayersControl;

    const handleCreated = (e) => {
        const { layerType, layer } = e;
        if (layerType === 'polygon') {
            const coords = layer.toGeoJSON();
            Cookies.get('selected_area')
            Cookies.set('selected_area', JSON.stringify(coords.geometry), { expires: 7 });
            console.log('Polygon Coordinates:', coords.geometry);
        }
    };

    return (
        <MapContainer center={[12.2958, 76.6394]} zoom={12} style={{ height: '100vh', width: '100%' }}>
            <LayersControl position="topright">
                {/* Standard OSM layer */}
                <BaseLayer checked name="OpenStreetMap">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    // attribution="&copy; OpenStreetMap contributors"
                    />
                </BaseLayer>

                {/* Hybrid: Satellite + Labels */}
                <BaseLayer name="Hybrid (Imagery + Labels)">
                    <LayerGroup>
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        //   attribution="&copy; Esri Imagery"
                        />
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                        //   attribution="&copy; Esri Labels"
                        />
                    </LayerGroup>
                </BaseLayer>
            </LayersControl>

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
