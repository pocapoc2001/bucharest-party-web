import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- FIX PENTRU ICONIȚELE LEAFLET (Code din App.jsx-ul nou) ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- COMPONENTA DE CONTROL (Pentru animația de zoom/pan) ---
const MapController = ({ selectedCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedCoords) {
      map.flyTo(selectedCoords, 16, { duration: 1.5 });
    }
  }, [selectedCoords, map]);
  return null;
};

// --- COMPONENTA PRINCIPALĂ ---
export default function InteractiveMap({ events, selectedEvent, onMarkerClick }) {
  // Coordonate default: Piața Universității
  const bucCoords = [44.4355, 26.1025]; 

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-gray-800 z-0">
      <MapContainer 
        center={bucCoords} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }} 
        className="bg-gray-900"
      >
        {/* Harta în mod Dark */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Controller-ul care mișcă harta când selectezi un eveniment din listă */}
        <MapController selectedCoords={selectedEvent?.coords} />

        {events.map((event) => (
          <Marker 
            key={event.id} 
            position={event.coords}
            eventHandlers={{ 
              click: () => onMarkerClick(event) 
            }}
          >
            <Popup className="text-gray-900 font-sans">
              <div className="p-1">
                <strong className="block text-sm">{event.venue}</strong>
                <span className="text-xs">{event.title}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}