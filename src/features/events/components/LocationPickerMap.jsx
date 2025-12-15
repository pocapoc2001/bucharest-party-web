import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Reusing your dot icon logic for consistency
const createPickerIcon = () => {
  return new L.DivIcon({
    className: 'bg-transparent border-none',
    html: `
      <div class="flex items-center justify-center w-full h-full">
        <span class="absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75 animate-ping"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white shadow-lg"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to handle clicks
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? (
    <Marker position={position} icon={createPickerIcon()} />
  ) : null;
};

export default function LocationPickerMap({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const bucCoords = [44.4355, 26.1025]; 

  const handleSetPosition = (latlng) => {
    setPosition(latlng);
    onLocationSelect([latlng.lat, latlng.lng]);
  };

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-700 relative z-0">
      <MapContainer 
        center={bucCoords} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#111827' }}
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationMarker position={position} setPosition={handleSetPosition} />
      </MapContainer>
      
      {!position && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 z-[401]">
          <span className="text-white text-sm bg-black/60 px-3 py-1 rounded-full border border-gray-600">
            Tap map to set location
          </span>
        </div>
      )}
    </div>
  );
}